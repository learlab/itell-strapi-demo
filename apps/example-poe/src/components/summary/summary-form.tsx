"use client";

import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { isLastPage } from "@/lib/location";
import { allPagesSorted } from "@/lib/pages";
import {
	createSummary,
	findFocusTime,
	getUserPageSummaryCount,
	incrementUserPage,
	isPageQuizUnfinished,
	maybeCreateQuizCookie,
} from "@/lib/server-actions";
import { getFeedback } from "@/lib/summary";
import { getChunkElement, makeInputKey, makePageHref } from "@/lib/utils";
import {
	ErrorFeedback,
	ErrorType,
	SummaryFeedback as SummaryFeedbackType,
	SummaryFormState,
	SummaryResponse,
	SummaryResponseSchema,
	simpleFeedback,
	validateSummary,
} from "@itell/core/summary";
import { Warning } from "@itell/ui/server";
import { Page } from "contentlayer/generated";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { useQA } from "../context/qa-context";
import { SummaryFeedback } from "./summary-feedback";
import { SummaryInput } from "./summary-input";
import { SummaryProceedModal } from "./summary-proceed-modal";
import { SummarySubmitButton } from "./summary-submit-button";

type Props = {
	value?: string;
	user: Session["user"];
	pageSlug: string;
	inputEnabled?: boolean; // needed to force enabled input for summary edit page
	textareaClassName?: string;
	isFeedbackEnabled: boolean;
};

type FormState = {
	canProceed: boolean;
	error: ErrorType | null;
	showQuiz: boolean;
};

type ChunkQuestion = {
	text: string;
	chunk: string;
	question_type: string;
};

export const SummaryForm = ({
	value,
	user,
	inputEnabled,
	pageSlug,
	isFeedbackEnabled,
	textareaClassName,
}: Props) => {
	const page = allPagesSorted.find((p) => p.page_slug === pageSlug) as Page;

	const [pending, setPending] = useState(false);
	const [buttonText, setButtonText] = useState("Submit");
	const [chunkQuestion, setChunkQuestion] = useState<ChunkQuestion | null>(
		null,
	);
	const [feedback, setFeedback] = useState<SummaryFeedbackType | null>(null);
	const [formState, setFormState] = useState<FormState>({
		canProceed: false,
		error: null,
		showQuiz: false,
	});

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setButtonText("Submitting...");
		setPending(true);

		const formData = new FormData(e.currentTarget);
		const input = (formData.get("input") as string).replaceAll("\u0000", "");
		const userId = user.id;
		localStorage.setItem(makeInputKey(pageSlug), input);

		const error = await validateSummary(input);
		if (error) {
			setPending(false);
			setButtonText("Submit");
			setFeedback(null);
			return setFormState((state) => ({ ...state, error }));
		}

		let feedback: SummaryFeedbackType | null = null;
		if (isFeedbackEnabled) {
			const focusTime = await findFocusTime(userId, pageSlug);

			const response = await fetch(
				"https://itell-api.learlab.vanderbilt.edu/score/summary/stairs",
				{
					method: "POST",
					body: JSON.stringify({
						summary: input,
						page_slug: pageSlug,
						focus_time: focusTime?.data,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (response.body) {
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let done = false;
				let chunkIndex = 0;
				let chunkQuestionString: string | null = null;

				while (!done) {
					const { value, done: doneReading } = await reader.read();
					done = doneReading;
					const chunk = decoder.decode(value);

					if (chunkIndex === 0) {
						const chunkData = JSON.parse(chunk.trim().replaceAll("\u0000", ""));
						const parsed = SummaryResponseSchema.safeParse(chunkData);
						if (parsed.success) {
							const summaryResponse = parsed.data;
							feedback = getFeedback(summaryResponse);

							setFeedback(feedback);
							setButtonText("Saving summary ...");

							await createSummary({
								text: input,
								pageSlug,
								isPassed: summaryResponse.is_passed,
								containmentScore: summaryResponse.containment,
								similarityScore: summaryResponse.similarity,
								wordingScore: summaryResponse.wording,
								contentScore: summaryResponse.content,
								user: {
									connect: {
										id: userId,
									},
								},
							});
						} else {
							setButtonText("Submit");
							setPending(false);
							setFormState((state) => ({
								...state,
								feedback: null,
								error: ErrorType.INTERNAL,
							}));
							// first chunk parsing failed, return early
							return;
						}
					} else {
						if (!done) {
							chunkQuestionString = chunk.trim().replaceAll("\u0000", "");
						} else {
							if (chunkQuestionString) {
								const chunkQuestionData = JSON.parse(
									chunkQuestionString,
								) as ChunkQuestion;
								setChunkQuestion(chunkQuestionData);
							}
						}
					}

					chunkIndex++;
				}
			}
		} else {
			feedback = simpleFeedback();

			setFeedback(feedback);
			setButtonText("Saving summary ...");

			await createSummary({
				text: input,
				pageSlug,
				isPassed: feedback.isPassed,
				containmentScore: -1,
				similarityScore: -1,
				wordingScore: -1,
				contentScore: -1,
				user: {
					connect: {
						id: userId,
					},
				},
			});
		}

		if (page.quiz) {
			maybeCreateQuizCookie(pageSlug);
		}

		const showQuiz = page.quiz ? isPageQuizUnfinished(pageSlug) : false;

		if (feedback) {
			if (feedback.isPassed) {
				await incrementUserPage(userId, pageSlug);
				setFormState({
					canProceed: !isLastPage(pageSlug),
					error: null,
					showQuiz,
				});
			} else {
				const summaryCount = await getUserPageSummaryCount(userId, pageSlug);
				if (summaryCount >= PAGE_SUMMARY_THRESHOLD) {
					await incrementUserPage(userId, pageSlug);
					setFormState({
						canProceed: !isLastPage(pageSlug),
						error: null,
						showQuiz,
					});
				}
			}
		}

		setPending(false);
		setButtonText("Submit");

		// setFormState({
		// 	canProceed: false,
		// 	error: null,
		// 	showQuiz: false,
		// });
	};

	const router = useRouter();
	const { isPageFinished, pageStatus } = useQA();
	const editDisabled = inputEnabled
		? false
		: pageStatus.isPageUnlocked
		  ? false
		  : !isPageFinished;

	useEffect(() => {
		if (formState.showQuiz) {
			router.push(`${makePageHref(pageSlug)}/quiz`);
		}
	}, [formState]);

	useEffect(() => {
		if (chunkQuestion) {
			console.log("chunkQuestion", chunkQuestion);
			const el = getChunkElement(chunkQuestion.chunk);
			if (el) {
				el.className = "border border-info";
				const yOffset = -70;
				const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

				window.scrollTo({ top: y, behavior: "smooth" });
			}
		}
	}, [chunkQuestion]);

	return (
		<section>
			{feedback && (
				<SummaryFeedback
					pageSlug={pageSlug}
					feedback={feedback}
					canProceed={formState.canProceed}
				/>
			)}
			<Confetti active={feedback?.isPassed ? isFeedbackEnabled : false} />
			<form className="mt-2 space-y-4" onSubmit={onSubmit}>
				<SummaryInput
					value={value}
					disabled={editDisabled}
					pageSlug={pageSlug}
					textAreaClassName={textareaClassName}
				/>
				{formState.error && <Warning>{ErrorFeedback[formState.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton
						text={buttonText}
						disabled={!isPageFinished}
						pending={pending}
					/>
				</div>
			</form>
			{formState.canProceed && !formState.showQuiz && (
				<SummaryProceedModal
					pageSlug={pageSlug}
					isPassed={feedback?.isPassed || false}
					title={
						isFeedbackEnabled
							? feedback?.isPassed
								? "Good job summarizing the text 🎉"
								: "You can now move on 👏"
							: "Your summary is accepted"
					}
				>
					<div className="space-y-2">
						{!feedback?.isPassed && (
							<p>You have written multiple summaries for this page.</p>
						)}
						<p>
							You can now move on to the next page by clicking the page link
							above the summary box or the left sidebar.
						</p>
					</div>
				</SummaryProceedModal>
			)}
		</section>
	);
};

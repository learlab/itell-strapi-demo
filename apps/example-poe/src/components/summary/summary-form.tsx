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
import { makeInputKey, makePageHref } from "@/lib/utils";
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
import { useEffect } from "react";
import { useFormState } from "react-dom";
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

export type FormState = SummaryFormState & {
	showQuiz: boolean;
};

const initialState: FormState = {
	canProceed: false,
	error: null,
	showQuiz: false,
	feedback: null,
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

	const onSubmit = async (
		prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		const input = (formData.get("input") as string).replaceAll("\u0000", "");
		const userId = user.id;

		localStorage.setItem(makeInputKey(pageSlug), input);

		const error = await validateSummary(input);
		if (error) {
			return { ...prevState, error };
		}

		let feedback: SummaryFeedbackType | null = null;
		let summaryResponse: SummaryResponse | null = null;
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

				while (!done) {
					const { value, done: doneReading } = await reader.read();
					done = doneReading;
					const chunk = decoder.decode(value);

					if (chunkIndex === 0) {
						const chunkData = JSON.parse(chunk.trim().replaceAll("\u0000", ""));
						const parsed = SummaryResponseSchema.safeParse(chunkData);
						if (parsed.success) {
							summaryResponse = parsed.data;
							feedback = getFeedback(parsed.data);
						}
					} else {
						// process later chunks
					}

					chunkIndex++;
				}
			}

			if (!summaryResponse) {
				return { ...prevState, feedback: null, error: ErrorType.INTERNAL };
			}

			if (!summaryResponse.english) {
				return {
					...prevState,
					feedback: null,
					error: ErrorType.LANGUAGE_NOT_EN,
				};
			}

			feedback = getFeedback(summaryResponse);

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
			feedback = simpleFeedback();
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

		if (feedback.isPassed) {
			await incrementUserPage(userId, pageSlug);

			return {
				canProceed: !isLastPage(pageSlug),
				error: null,
				showQuiz,
				feedback,
			};
		}

		const summaryCount = await getUserPageSummaryCount(userId, pageSlug);
		if (summaryCount >= PAGE_SUMMARY_THRESHOLD) {
			await incrementUserPage(userId, pageSlug);

			return {
				canProceed: !isLastPage(pageSlug),
				error: null,
				showQuiz,
				feedback,
			};
		}

		return {
			canProceed: false,
			error: null,
			showQuiz: false,
			feedback,
		};
	};

	const [formState, formAction] = useFormState(onSubmit, initialState);
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

	return (
		<section>
			{formState.feedback && (
				<SummaryFeedback
					pageSlug={pageSlug}
					feedback={formState.feedback}
					canProceed={formState.canProceed}
				/>
			)}
			<Confetti
				active={formState.feedback?.isPassed ? isFeedbackEnabled : false}
			/>
			<form className="mt-2 space-y-4" action={formAction}>
				<SummaryInput
					value={value}
					disabled={editDisabled}
					pageSlug={pageSlug}
					textAreaClassName={textareaClassName}
				/>
				{formState.error && <Warning>{ErrorFeedback[formState.error]}</Warning>}
				<div className="flex justify-end">
					{/* isPageUnfinished is undefine when used in summary [id] page */}
					<SummarySubmitButton
						disabled={isPageFinished === undefined ? false : !isPageFinished}
					/>
				</div>
			</form>
			{formState.canProceed && !formState.showQuiz && (
				<SummaryProceedModal
					pageSlug={pageSlug}
					isPassed={formState.feedback?.isPassed || false}
					title={
						isFeedbackEnabled
							? formState.feedback?.isPassed
								? "Good job summarizing the text 🎉"
								: "You can now move on 👏"
							: "Your summary is accepted"
					}
				>
					<div className="space-y-2">
						{!formState.feedback?.isPassed && (
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

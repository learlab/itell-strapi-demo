"use client";

import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { isLastPage } from "@/lib/location";
import {
	createSummary,
	findFocusTime,
	getUserPageSummaryCount,
	incrementUserPage,
	isPageQuizUnfinished,
	maybeCreateQuizCookie,
} from "@/lib/server-actions";
import { getFeedback } from "@/lib/summary";
import { getChunkElement, makeInputKey } from "@/lib/utils";
import {
	ErrorFeedback,
	ErrorType,
	SummaryResponse,
	SummaryResponseSchema,
	simpleSummaryResponse,
	validateSummary,
} from "@itell/core/summary";
import { Warning } from "@itell/ui/server";
import { driver } from "driver.js";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { useImmerReducer } from "use-immer";
import { Button } from "../client-components";
import { useQA } from "../context/qa-context";
import { SummaryFeedback } from "./summary-feedback";
import { SummaryInput } from "./summary-input";
import { SummaryProceedModal } from "./summary-proceed-modal";
import { StageItem, SummaryProgress } from "./summary-progress";
import { SummarySubmitButton } from "./summary-submit-button";

type Props = {
	value?: string;
	user: Session["user"];
	pageSlug: string;
	hasQuiz: boolean;
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

type State = {
	pending: boolean;
	error: ErrorType | null;
	response: SummaryResponse | null;
	chunkQuestion: ChunkQuestion | null;
	canProceed: boolean;
	showQuiz: boolean;
};

type Action =
	| { type: "submit" }
	| { type: "fail"; payload: ErrorType }
	| { type: "scored"; payload: SummaryResponse }
	| { type: "ask"; payload: ChunkQuestion }
	| { type: "finish"; payload: { canProceed: boolean; showQuiz: boolean } };

const initialState: State = {
	pending: false,
	error: null,
	response: null,
	chunkQuestion: null,
	canProceed: false,
	showQuiz: false,
};

type Stage = "Scoring" | "Saving" | "Generating";

export const SummaryForm = ({
	value,
	user,
	inputEnabled,
	pageSlug,
	hasQuiz,
	isFeedbackEnabled,
	textareaClassName,
}: Props) => {
	const driverObj = driver();

	const [stages, setStages] = useState<StageItem[]>([]);
	const addStage = (name: Stage) => {
		setStages((currentStages) => {
			const newStage: StageItem = { name, status: "active" };
			const oldStages = currentStages.slice();
			oldStages.push(newStage);
			return oldStages;
		});
	};

	const finishStage = (name: Stage) => {
		setStages((currentStages) => {
			const newStage: StageItem = { name, status: "complete" };
			const oldStages = currentStages.slice();
			const index = oldStages.findIndex((s) => s.name === name);
			if (index !== -1) {
				oldStages[index] = newStage;
			}
			return oldStages;
		});
	};

	const [state, dispatch] = useImmerReducer<State, Action>((draft, action) => {
		switch (action.type) {
			case "submit":
				draft.pending = true;
				draft.error = null;
				draft.response = null;
				draft.chunkQuestion = null;
				break;
			case "fail":
				draft.pending = false;
				draft.error = action.payload;
				draft.response = null;
				break;
			case "scored":
				draft.response = action.payload;
				break;
			case "ask":
				draft.chunkQuestion = action.payload;
				draft.pending = false;
				break;
			case "finish":
				draft.pending = false;
				draft.canProceed = action.payload.canProceed;
				draft.showQuiz = action.payload.showQuiz;
				break;
		}
	}, initialState);

	const feedback = state.response ? getFeedback(state.response) : null;

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStages([]);

		const formData = new FormData(e.currentTarget);
		const input = (formData.get("input") as string).replaceAll("\u0000", "");
		const userId = user.id;
		localStorage.setItem(makeInputKey(pageSlug), input);

		dispatch({ type: "submit" });

		const error = validateSummary(input);
		if (error) {
			dispatch({ type: "fail", payload: error });
			return;
		}

		let summaryResponse: SummaryResponse | null = null;

		try {
			if (isFeedbackEnabled) {
				addStage("Scoring");
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
							const chunkData = JSON.parse(
								chunk.trim().replaceAll("\u0000", ""),
							);
							const parsed = SummaryResponseSchema.safeParse(chunkData);
							if (parsed.success) {
								summaryResponse = parsed.data;
								dispatch({ type: "scored", payload: parsed.data });
								finishStage("Scoring");
							} else {
								console.log("SummaryResults parse error", parsed.error);
								setStages([]);
								dispatch({ type: "fail", payload: ErrorType.INTERNAL });
								// first chunk parsing failed, return early
								return;
							}
						} else {
							if (chunkIndex === 1) {
								addStage("Generating");
							}
							if (!done) {
								chunkQuestionString = chunk.trim().replaceAll("\u0000", "");
							} else {
								if (chunkQuestionString) {
									const chunkQuestionData = JSON.parse(
										chunkQuestionString,
									) as ChunkQuestion;
									finishStage("Generating");
									dispatch({ type: "ask", payload: chunkQuestionData });
								}
							}
						}

						chunkIndex++;
					}
				}
			} else {
				const summaryResponse = simpleSummaryResponse();
				dispatch({ type: "scored", payload: summaryResponse });
				finishStage("Scoring");
			}

			if (summaryResponse) {
				addStage("Saving");
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

				if (hasQuiz) {
					maybeCreateQuizCookie(pageSlug);
				}

				const showQuiz = hasQuiz ? isPageQuizUnfinished(pageSlug) : false;

				if (summaryResponse.is_passed) {
					await incrementUserPage(userId, pageSlug);
					dispatch({
						type: "finish",
						payload: { canProceed: !isLastPage(pageSlug), showQuiz },
					});
				} else {
					const summaryCount = await getUserPageSummaryCount(userId, pageSlug);
					if (summaryCount >= PAGE_SUMMARY_THRESHOLD) {
						await incrementUserPage(userId, pageSlug);
						dispatch({
							type: "finish",
							payload: { canProceed: !isLastPage(pageSlug), showQuiz },
						});
					}
				}

				finishStage("Saving");
			}
		} catch (err) {
			console.error(err);
			setStages([]);
			dispatch({ type: "fail", payload: ErrorType.INTERNAL });
		}
	};

	const router = useRouter();
	const { isPageFinished, pageStatus } = useQA();
	const editDisabled = inputEnabled
		? false
		: pageStatus.isPageUnlocked
		  ? false
		  : !isPageFinished;

	const checkQuestion = () => {
		if (state.chunkQuestion) {
			const el = getChunkElement(state.chunkQuestion.chunk);
			if (el) {
				const yOffset = -70;
				const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

				window.scrollTo({ top: y, behavior: "smooth" });

				setTimeout(() => {
					driverObj.highlight({
						element: el,
						popover: {
							title: "Re-read this paragraph and answer the question below",
							description: state.chunkQuestion?.text,
						},
					});
				}, 1000);
			}
		}
	};

	useEffect(() => {
		if (state.showQuiz) {
			// router.push(`${makePageHref(pageSlug)}/quiz`);
		}
	}, [state]);

	return (
		<section className="space-y-2">
			<SummaryProgress items={stages} />
			{state.chunkQuestion && (
				<Button variant={"outline"} onClick={checkQuestion}>
					Check Question
				</Button>
			)}
			{feedback && (
				<SummaryFeedback
					pageSlug={pageSlug}
					feedback={feedback}
					canProceed={state.canProceed}
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
				{state.error && <Warning>{ErrorFeedback[state.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton
						disabled={!isPageFinished}
						pending={state.pending}
					/>
				</div>
			</form>
			{state.canProceed && !state.showQuiz && (
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

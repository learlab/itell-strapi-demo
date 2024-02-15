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
import {
	PageData,
	getChunkElement,
	hideSiteNav,
	makeInputKey,
	makePageHref,
	showSiteNav,
} from "@/lib/utils";
import { usePortal } from "@itell/core/hooks";
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
import "driver.js/dist/driver.css";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { ReactPortal, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useImmerReducer } from "use-immer";
import { Chatbot } from "../chat/chatbot";
import { ChatbotChunkQuestion } from "../chat/chatbot-chunk-question";
import { Button } from "../client-components";
import { useChat } from "../context/chat-context";
import { useQA } from "../context/qa-context";
import { SummaryFeedback } from "./summary-feedback";
import { SummaryInput } from "./summary-input";
import { StageItem } from "./summary-progress";
import { SummarySubmitButton } from "./summary-submit-button";

type Props = {
	value?: string;
	user: Session["user"];
	page: PageData;
	hasQuiz: boolean;
	inputEnabled?: boolean; // needed to force enabled input for summary edit page
	isFeedbackEnabled: boolean;
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

const driverObj = driver();

export const SummaryForm = ({
	value,
	user,
	inputEnabled,
	page,
	hasQuiz,
	isFeedbackEnabled,
}: Props) => {
	const pageSlug = page.page_slug;
	const { nodes, addNode } = usePortal();
	const { clearChunkQuestionMessages, chunkQuestionAnswered } = useChat();

	driverObj.setConfig({
		onPopoverRender: (popover) => {
			clearChunkQuestionMessages();
			addNode(
				<ChatbotChunkQuestion user={user} pageSlug={pageSlug} />,
				popover.wrapper,
			);
		},
		onDestroyStarted: () => {
			if (!chunkQuestionAnswered) {
				return toast.warning("Please answer the question to continue");
			}

			driverObj.destroy();
			showSiteNav();
		},
	});

	const router = useRouter();
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
					response: summaryResponse,
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
			console.log("summary scoring error", err);
			setStages([]);
			dispatch({ type: "fail", payload: ErrorType.INTERNAL });
		}
	};

	const { isPageFinished, pageStatus } = useQA();
	const editDisabled = inputEnabled
		? false
		: pageStatus.isPageUnlocked
		  ? false
		  : !isPageFinished;

	const goToQuestion = () => {
		if (state.chunkQuestion) {
			const el = getChunkElement(state.chunkQuestion.chunk);
			if (el) {
				hideSiteNav();
				const yOffset = -70;
				const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

				window.scrollTo({ top: y, behavior: "smooth" });

				setTimeout(() => {
					driverObj.highlight({
						element: el,
						popover: {
							description:
								"Please re-read and highlighted paragraph. After re-reading, you will be asked a question to assess your understanding.",
							side: "left",
							align: "start",
						},
					});
				}, 1000);
			}
		}
	};

	useEffect(() => {
		if (state.chunkQuestion) {
			goToQuestion();
		}

		if (state.showQuiz) {
			toast("Good job 🎉", {
				description:
					"Before moving on, please finish a short quiz to assess your understanding",
				duration: Infinity,
				action: {
					label: "Take quiz",
					onClick: () => {
						router.push(`${makePageHref(page.page_slug)}/quiz`);
					},
				},
			});
		}

		if (state.canProceed && !state.showQuiz) {
			const title = isFeedbackEnabled
				? feedback?.isPassed
					? "Good job summarizing 🎉"
					: "You can now move on 👏"
				: "Your summary is accepted";
			toast(title, {
				description: "Move to the next page to continue reading",
				duration: Infinity,
				action: page.nextPageSlug
					? {
							label: "Proceed",
							onClick: () => {
								router.push(makePageHref(page.nextPageSlug as string));
							},
					  }
					: undefined,
			});
		}
	}, [state]);

	return (
		<section className="space-y-2">
			{nodes}
			{state.chunkQuestion && (
				<Button variant={"outline"} onClick={goToQuestion}>
					Go to question
				</Button>
			)}
			{feedback && (
				<SummaryFeedback
					nextPageSlug={page.nextPageSlug}
					feedback={feedback}
					canProceed={state.canProceed}
				/>
			)}

			<Confetti active={feedback?.isPassed ? isFeedbackEnabled : false} />
			<form className="mt-2 space-y-4" onSubmit={onSubmit}>
				<SummaryInput
					value={value}
					disabled={editDisabled || state.pending}
					pageSlug={pageSlug}
					pending={state.pending}
					stages={stages}
				/>
				{state.error && <Warning>{ErrorFeedback[state.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton
						disabled={!isPageFinished}
						pending={state.pending}
					/>
				</div>
			</form>
		</section>
	);
};

"use client";

import { SessionUser } from "@/lib/auth";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { isLastPage } from "@/lib/location";
import { PageStatus } from "@/lib/page-status";
import {
	createSummary,
	findFocusTime,
	getUserPageSummaryCount,
	incrementUserPage,
	isPageQuizUnfinished,
	maybeCreateQuizCookie,
} from "@/lib/server-actions";
import { getChatHistory, useChatStore } from "@/lib/store/chat";
import { getFeedback } from "@/lib/summary";
import {
	PageData,
	getChunkElement,
	makeInputKey,
	makePageHref,
	scrollToElement,
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
import { Warning, buttonVariants } from "@itell/ui/server";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useImmerReducer } from "use-immer";
import { ChatbotChunkQuestion } from "../chat/chatbot-chunk-question";
import { Button } from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";
import { SummaryFeedback } from "./summary-feedback";
import { SummaryInput } from "./summary-input";
import { SummarySubmitButton } from "./summary-submit-button";

type Props = {
	value?: string;
	user: NonNullable<SessionUser>;
	page: PageData;
	hasQuiz: boolean;
	isFeedbackEnabled: boolean;
	pageStatus: PageStatus;
	isAdmin?: boolean;
};

type ChunkQuestion = {
	text: string;
	chunk: string;
	question_type: string;
};

type State = {
	pending: boolean;
	isPassed: boolean;
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
	| { type: "finish"; payload: { canProceed: boolean; showQuiz: boolean } }
	| { type: "set_passed"; payload: boolean };

const initialState: State = {
	pending: false,
	error: null,
	response: null,
	chunkQuestion: null,
	isPassed: false,
	canProceed: false,
	showQuiz: false,
};

const driverObj = driver();

const goToQuestion = (chunkQuestion: ChunkQuestion) => {
	const el = getChunkElement(chunkQuestion.chunk);
	if (el) {
		scrollToElement(el);

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
};

const exitQuestion = () => {
	const summaryEl = document.querySelector("#page-summary");

	driverObj.destroy();

	if (summaryEl) {
		scrollToElement(summaryEl as HTMLDivElement);
	}
};

export const SummaryForm = ({
	value,
	user,
	page,
	hasQuiz,
	isFeedbackEnabled,
	pageStatus,
	isAdmin,
}: Props) => {
	const pageSlug = page.page_slug;
	const isPageFinished = useConstructedResponse(
		(state) => state.isPageFinished,
	);
	const editDisabled = pageStatus.isPageUnlocked ? false : !isPageFinished;
	const { chunkQuestionAnswered, addChunkQuestion, messages } = useChatStore(
		(state) => ({
			chunkQuestionAnswered: state.chunkQuestionAnswered,
			addChunkQuestion: state.addChunkQuestion,
			messages: state.messages,
		}),
	);
	const excludedChunks = useConstructedResponse(
		(state) => state.excludedChunks,
	);
	const { nodes: portalNodes, addNode } = usePortal();
	const router = useRouter();
	const { stages, addStage, finishStage, clearStages } = useSummaryStage();

	const mounted = useRef(false);

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
			case "set_passed":
				draft.isPassed = action.payload;
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

	if (mounted.current) {
		driverObj.setConfig({
			smoothScroll: false,
			onPopoverRender: (popover) => {
				addNode(
					<ChatbotChunkQuestion
						user={user}
						pageSlug={pageSlug}
						onExit={exitQuestion}
					/>,
					popover.wrapper,
				);
			},
			onDestroyStarted: () => {
				if (!chunkQuestionAnswered) {
					return toast.warning("Please answer the question to continue");
				}

				exitQuestion();
			},
		});
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		clearStages();

		dispatch({ type: "submit" });
		addStage("Scoring");

		const formData = new FormData(e.currentTarget);
		const input = (formData.get("input") as string).replaceAll("\u0000", "");
		const userId = user.id;
		localStorage.setItem(makeInputKey(pageSlug), input);

		const error = validateSummary(input);
		if (error) {
			dispatch({ type: "fail", payload: error });
			return;
		}

		const summaryCount = await getUserPageSummaryCount(userId, pageSlug);
		const isEnoughSummary = summaryCount >= PAGE_SUMMARY_THRESHOLD;

		let summaryResponse: SummaryResponse | null = null;
		let chunkQuestionData: ChunkQuestion | null = null;

		try {
			if (isFeedbackEnabled) {
				const focusTime = await findFocusTime(userId, pageSlug);
				const requestBody = JSON.stringify({
					summary: input,
					page_slug: pageSlug,
					focus_time: focusTime?.data,
					chat_history: getChatHistory(messages),
					excluded_chunks: excludedChunks,
				});
				const response = await fetch(
					"https://itell-api.learlab.vanderbilt.edu/score/summary/stairs",
					{
						method: "POST",
						body: requestBody,
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
				console.log("request body", requestBody);

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
							const chunkString = chunk.trim().replaceAll("\u0000", "");
							console.log("chunkString", chunkString);
							const parsed = SummaryResponseSchema.safeParse(
								JSON.parse(chunkString),
							);
							if (parsed.success) {
								summaryResponse = parsed.data;
								dispatch({
									type: "set_passed",
									payload: summaryResponse.is_passed || isEnoughSummary,
								});
								dispatch({ type: "scored", payload: parsed.data });
								finishStage("Scoring");
							} else {
								console.log("SummaryResults parse error", parsed.error);
								clearStages();
								dispatch({ type: "fail", payload: ErrorType.INTERNAL });
								// summaryResponse parsing failed, return early
								return;
							}
						} else {
							if (summaryResponse?.is_passed) {
								// if the summary passed, we don't need to process later chunks
								// note that if the user pass by summary amount
								// question will still be generated but will not be asked
								// they can still see the "question" button
								break;
							}

							if (chunkIndex === 1) {
								addStage("Analyzing");
							}
							if (!done) {
								chunkQuestionString = chunk.trim().replaceAll("\u0000", "");
							} else {
								if (chunkQuestionString) {
									chunkQuestionData = JSON.parse(
										chunkQuestionString,
									) as ChunkQuestion;
									finishStage("Analyzing");
									addChunkQuestion(chunkQuestionData.text);
								}
							}
						}

						chunkIndex++;
					}
				}
			} else {
				summaryResponse = simpleSummaryResponse();
				dispatch({ type: "set_passed", payload: true });
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

				if (
					summaryResponse.is_passed ||
					isEnoughSummary ||
					!isFeedbackEnabled
				) {
					await incrementUserPage(userId, pageSlug);
					dispatch({
						type: "finish",
						payload: { canProceed: !isLastPage(pageSlug), showQuiz },
					});
				}
				finishStage("Saving");

				if (chunkQuestionData) {
					dispatch({ type: "ask", payload: chunkQuestionData });
				}
			}
		} catch (err) {
			console.log("summary scoring error", err);
			clearStages();
			dispatch({ type: "fail", payload: ErrorType.INTERNAL });
		}
	};

	useEffect(() => {
		if (state.chunkQuestion && !state.isPassed) {
			goToQuestion(state.chunkQuestion);
		}

		if (state.showQuiz) {
			toast("Good job 🎉", {
				className: "toast",
				description:
					"Before moving on, please finish a short quiz to assess your understanding",
				duration: 5000,
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
				className: "toast",
				description: "Move to the next page to continue reading",
				duration: 5000,
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

	useEffect(() => {
		mounted.current = true;
	}, []);

	return (
		<section className="space-y-2">
			{portalNodes}
			<div className="flex gap-2 items-center">
				{state.canProceed && page.nextPageSlug && (
					<Link
						href={page.nextPageSlug}
						className={buttonVariants({ variant: "outline" })}
					>
						Go to next page
					</Link>
				)}
				{state.chunkQuestion && (
					<Button
						variant={"outline"}
						onClick={() => goToQuestion(state.chunkQuestion as ChunkQuestion)}
					>
						See question
					</Button>
				)}
			</div>

			{feedback && <SummaryFeedback feedback={feedback} />}

			<Confetti active={feedback?.isPassed ? isFeedbackEnabled : false} />
			<form className="mt-2 space-y-4" onSubmit={onSubmit}>
				<SummaryInput
					value={value}
					disabled={editDisabled || state.pending}
					isAdmin={isAdmin}
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

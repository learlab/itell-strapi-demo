"use client";

import { useSessionAction } from "@/lib/auth/context";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { Condition } from "@/lib/control/condition";
import { createEvent } from "@/lib/event/actions";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { getChatHistory, useChatStore } from "@/lib/store/chat";
import {
	countUserPageSummary,
	createSummary,
	findFocusTime,
} from "@/lib/summary/actions";
import { getFeedback } from "@/lib/summary/feedback";
import { incrementUserPage } from "@/lib/user/actions";
import {
	PageData,
	getChunkElement,
	makePageHref,
	reportSentry,
	scrollToElement,
} from "@/lib/utils";
import { usePortal } from "@itell/core/hooks";
import {
	ErrorFeedback,
	ErrorType,
	SummaryResponse,
	SummaryResponseSchema,
	validateSummary,
} from "@itell/core/summary";
import { Warning, buttonVariants } from "@itell/ui/server";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { User } from "lucia";
import { FileQuestionIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import { useImmerReducer } from "use-immer";
import { ChatStairs } from "../chat/chat-stairs";
import { Button, StatusButton } from "../client-components";
import { NextPageButton } from "../page/next-page-button";
import { useConstructedResponse } from "../provider/page-provider";
import { SummaryFeedback } from "./summary-feedback";
import { SummaryInput, saveSummaryLocal } from "./summary-input";

type Props = {
	user: User;
	page: PageData;
	pageStatus: PageStatus;
};

type StairsQuestion = {
	text: string;
	chunk: string;
	question_type: string;
};

type State = {
	prevInput: string;
	isPassed: boolean;
	error: ErrorType | null;
	response: SummaryResponse | null;
	stairsQuestion: StairsQuestion | null;
	canProceed: boolean;
};

type Action =
	| { type: "submit" }
	| { type: "fail"; payload: ErrorType }
	| { type: "scored"; payload: SummaryResponse }
	| { type: "stairs"; payload: StairsQuestion }
	| { type: "finish"; payload: { canProceed: boolean } }
	| { type: "set_passed"; payload: boolean }
	| { type: "set_prev_input"; payload: string };

const driverObj = driver();

const exitQuestion = () => {
	const summaryEl = document.querySelector("#page-summary");

	driverObj.destroy();

	if (summaryEl) {
		scrollToElement(summaryEl as HTMLDivElement);
	}
};

export const SummaryFormStairs = ({ user, page, pageStatus }: Props) => {
	const initialState: State = {
		prevInput: "",
		error: null,
		response: null,
		stairsQuestion: null,
		isPassed: false,
		canProceed: pageStatus.unlocked,
	};
	const { updateUser } = useSessionAction();

	const pageSlug = page.page_slug;
	const [isTextbookFinished, setIsTextbookFinished] = useState(user.finished);
	const { stairsAnswered, addStairsQuestion, messages } = useChatStore(
		(state) => ({
			stairsAnswered: state.stairsAnswered,
			addStairsQuestion: state.addStairsQuestion,
			messages: state.messages,
		}),
	);
	const { excludedChunks } = useConstructedResponse((state) => ({
		excludedChunks: state.excludedChunks,
	}));
	const [state, dispatch] = useImmerReducer<State, Action>((draft, action) => {
		switch (action.type) {
			case "submit":
				draft.error = null;
				break;
			case "fail":
				draft.error = action.payload;
				draft.response = null;
				break;
			case "scored":
				draft.response = action.payload;
				break;
			case "set_passed":
				draft.isPassed = action.payload;
				break;
			case "stairs":
				draft.stairsQuestion = action.payload;
				break;
			case "set_prev_input":
				draft.prevInput = action.payload;
				break;
			case "finish":
				draft.canProceed = action.payload.canProceed;
				break;
		}
	}, initialState);

	const { nodes: portalNodes, addNode } = usePortal();
	const isSummaryReady = useConstructedResponse(
		(state) => state.isSummaryReady,
	);
	const router = useRouter();
	const { addStage, clearStages, finishStage, stages } = useSummaryStage();
	const feedback = state.response ? getFeedback(state.response) : null;

	const requestBodyRef = useRef<string | null>(null);
	const summaryResponseRef = useRef<SummaryResponse | null>(null);
	const stairsDataRef = useRef<StairsQuestion | null>(null);

	const goToQuestion = (question: StairsQuestion) => {
		const el = getChunkElement(question.chunk);
		if (el) {
			scrollToElement(el);
			driverObj.highlight({
				element: el,
				popover: {
					description:
						"Please re-read the highlighted chunk. After re-reading, you will be asked a question to assess your understanding. When you are finished, press the 'return to summary' button",
				},
			});
		} else {
			toast.warning(
				"No question found, please revise your summary or move on to the next page",
			);
		}
	};

	useEffect(() => {
		driverObj.setConfig({
			smoothScroll: false,
			animate: false,
			onPopoverRender: (popover) => {
				addNode(
					<ChatStairs
						userId={user.id}
						userImage={user.image}
						userName={user.name}
						pageSlug={pageSlug}
						onExit={exitQuestion}
					/>,
					popover.wrapper,
				);
			},
			onDestroyStarted: () => {
				if (!stairsAnswered) {
					return toast.warning("Please answer the question to continue");
				}

				exitQuestion();
			},
		});
	}, []);

	const { action, isPending, isDelayed, isError, error, status } =
		useActionStatus(
			async (e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				clearStages();

				dispatch({ type: "submit" });
				addStage("Scoring");

				const formData = new FormData(e.currentTarget);
				const input = String(formData.get("input")).replaceAll("\u0000", "");

				const userId = user.id;
				saveSummaryLocal(pageSlug, input);

				const error = validateSummary(
					input,
					state.prevInput === "" ? undefined : state.prevInput,
				);

				if (error) {
					dispatch({ type: "fail", payload: error });
					return;
				}

				// set prev input here so we are not comparing consecutive error summaries
				dispatch({ type: "set_prev_input", payload: input });
				const summaryCount = await countUserPageSummary(userId, pageSlug);
				const isEnoughSummary = summaryCount + 1 >= PAGE_SUMMARY_THRESHOLD;

				const focusTime = await findFocusTime(userId, pageSlug);
				const body = JSON.stringify({
					summary: input,
					page_slug: pageSlug,
					focus_time: focusTime?.data,
					chat_history: getChatHistory(messages),
					excluded_chunks: excludedChunks,
				});
				requestBodyRef.current = body;
				const response = await fetch("/api/itell/score/stairs", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body,
				});

				if (response.ok && response.body) {
					const reader = response.body.getReader();
					const decoder = new TextDecoder();
					let done = false;
					let chunkIndex = 0;
					let stairsChunk: string | null = null;

					while (!done) {
						const { value, done: doneReading } = await reader.read();
						done = doneReading;
						const chunk = decoder.decode(value, { stream: true });

						if (chunkIndex === 0) {
							const data = chunk
								.trim()
								.split("\n")
								.at(1)
								?.replace(/data:\s+/, "");

							console.log("summary response chunk", data);

							const parsed = SummaryResponseSchema.safeParse(
								JSON.parse(String(data)),
							);
							if (parsed.success) {
								summaryResponseRef.current = parsed.data;
								dispatch({
									type: "set_passed",
									payload: parsed.data.is_passed || isEnoughSummary,
								});
								dispatch({ type: "scored", payload: parsed.data });
								finishStage("Scoring");
							} else {
								console.log("SummaryResults parse error", parsed.error);
								clearStages();
								dispatch({ type: "fail", payload: ErrorType.INTERNAL });
								// summaryResponse parsing failed, return early
								reportSentry("parse summary stairs", {
									body,
									chunk: data,
								});
								return;
							}
						} else {
							if (summaryResponseRef.current?.is_passed) {
								// if the summary passed, we don't need to process later chunks
								// note that if the user pass by summary amount
								// question will still be generated but will not be asked
								// they can still see the "question" button
								break;
							}

							if (chunkIndex === 1) {
								addStage("Analyzing");
							}
							if (chunk) {
								stairsChunk = chunk;
							}
						}

						chunkIndex++;
					}

					if (stairsChunk) {
						const regex = /data: ({"request_id":.*?})\n*/;
						const match = stairsChunk.trim().match(regex);
						console.log("final stairs chunk\n", stairsChunk);
						if (match?.[1]) {
							const stairsString = match[1];
							console.log("parsed as", stairsString);
							const stairsData = JSON.parse(stairsString) as StairsQuestion;
							stairsDataRef.current = stairsData;
							finishStage("Analyzing");
							addStairsQuestion(stairsData);

							createEvent({
								type: "stairs-question",
								pageSlug,
								userId: user.id,
								data: stairsData,
							});
						} else {
							throw new Error("invalid stairs chunk");
						}
					}
				} else {
					throw new Error(await response.text());
				}

				if (summaryResponseRef.current) {
					const scores = summaryResponseRef.current;
					addStage("Saving");
					const shouldUpdateUser = scores.is_passed || isEnoughSummary;
					await createSummary({
						text: input,
						userId: user.id,
						pageSlug,
						condition: Condition.STAIRS,
						isPassed: scores.is_passed || false,
						containmentScore: scores.containment,
						similarityScore: scores.similarity,
						languageScore: scores.language,
						contentScore: scores.content,
					});

					finishStage("Saving");

					if (shouldUpdateUser) {
						const nextSlug = await incrementUserPage(user.id, pageSlug);
						if (isLastPage(pageSlug)) {
							updateUser({ finished: true });
							setIsTextbookFinished(true);
							toast.info("You have finished the entire textbook!");
						} else {
							updateUser({ pageSlug: nextSlug });
							// check if we can already proceed to prevent excessive toasts
							if (!state.canProceed) {
								const title = feedback?.isPassed
									? "Good job summarizing 🎉"
									: "You can now move on 👏";
								toast(title, {
									className: "toast",
									description: "Move to the next page to continue reading",
									duration: 5000,
									action: page.nextPageSlug
										? {
												label: "Proceed",
												onClick: () => {
													router.push(
														makePageHref(page.nextPageSlug as string),
													);
												},
											}
										: undefined,
								});
							}
						}
						dispatch({
							type: "finish",
							payload: { canProceed: !isLastPage(pageSlug) },
						});
					}

					if (stairsDataRef.current) {
						dispatch({ type: "stairs", payload: stairsDataRef.current });
						if (!shouldUpdateUser) {
							goToQuestion(stairsDataRef.current);
						}
					}
				}
			},
			{ delayTimeout: 20000 },
		);

	useEffect(() => {
		if (isError) {
			console.log("summary scoring", error);
			dispatch({ type: "fail", payload: ErrorType.INTERNAL });
			clearStages();
			reportSentry("score summary stairs", {
				body: requestBodyRef.current,
				summaryResponse: summaryResponseRef.current,
				stairsData: stairsDataRef.current,
				error,
			});
		}
	}, [isError]);

	return (
		<section className="space-y-2">
			{portalNodes}

			<SummaryFeedback
				className={isPending ? "opacity-70" : ""}
				feedback={feedback}
				needRevision={
					isLastPage(pageSlug) ? isTextbookFinished : state.canProceed
				}
			/>

			<div className="flex gap-2 items-center">
				{state.canProceed && page.nextPageSlug && (
					<NextPageButton pageSlug={page.nextPageSlug} />
				)}
				{state.stairsQuestion && (
					<Button
						variant={"outline"}
						onClick={() => goToQuestion(state.stairsQuestion as StairsQuestion)}
					>
						<span>See question</span>
						<FileQuestionIcon className="size-4 ml-2" />
					</Button>
				)}
			</div>

			{isTextbookFinished && (
				<div className="space-y-2">
					<p>You have finished the entire textbook. Congratulations! 🎉</p>
				</div>
			)}

			<Confetti active={feedback?.isPassed || false} />
			<form className="mt-2 space-y-4" onSubmit={action}>
				<SummaryInput
					disabled={!isSummaryReady}
					pageSlug={pageSlug}
					pending={isPending}
					stages={stages}
					userRole={user.role}
				/>
				{state.error && <Warning>{ErrorFeedback[state.error]}</Warning>}
				<div className="flex justify-end">
					<StatusButton disabled={!isSummaryReady} pending={isPending}>
						{status === "idle" ? "Submit" : "Resubmit"}
					</StatusButton>
				</div>
			</form>
			{isDelayed && (
				<p className="text-sm">
					The request is taking longer than usual, if this keeps loading without
					a response, please try refreshing the page. If the problem persists,
					please report to lear.lab.vu@gmail.com.
				</p>
			)}
		</section>
	);
};

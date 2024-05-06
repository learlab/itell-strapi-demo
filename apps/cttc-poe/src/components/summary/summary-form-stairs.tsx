"use client";

import { env } from "@/env.mjs";
import { SessionUser } from "@/lib/auth";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
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
import * as Sentry from "@sentry/nextjs";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useImmerReducer } from "use-immer";
import { ChatStairs } from "../chat/chat-stairs";
import { Button } from "../client-components";
import { PageLink } from "../page/page-link";
import { useConfig, useConstructedResponse } from "../provider/page-provider";
import { SummaryFeedback } from "./summary-feedback";
import { SummaryInput, saveSummaryLocal } from "./summary-input";
import { SummarySubmitButton } from "./summary-submit-button";

type Props = {
	user: NonNullable<SessionUser>;
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
	pending: boolean;
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
	| { type: "ask"; payload: StairsQuestion }
	| { type: "finish"; payload: { canProceed: boolean } }
	| { type: "set_passed"; payload: boolean }
	| { type: "set_prev_input"; payload: string };

const initialState: State = {
	prevInput: "",
	pending: false,
	error: null,
	response: null,
	stairsQuestion: null,
	isPassed: false,
	canProceed: false,
};

const driverObj = driver();

const exitQuestion = () => {
	const summaryEl = document.querySelector("#page-summary");

	driverObj.destroy();

	if (summaryEl) {
		scrollToElement(summaryEl as HTMLDivElement);
	}
};

export const SummaryFormStairs = ({ user, page, pageStatus }: Props) => {
	const pageSlug = page.page_slug;
	const mounted = useRef(false);

	const feedbackType = useConfig((selector) => selector.feedbackType);
	const { stairsAnswered, addStairsQuestion, messages } = useChatStore(
		(state) => ({
			stairsAnswered: state.stairsAnswered,
			addStairsQuestion: state.addStairsQuestion,
			messages: state.messages,
		}),
	);
	const excludedChunks = useConstructedResponse(
		(state) => state.excludedChunks,
	);
	const [state, dispatch] = useImmerReducer<State, Action>((draft, action) => {
		switch (action.type) {
			case "set_prev_input":
				draft.prevInput = action.payload;
				break;
			case "submit":
				draft.pending = true;
				draft.error = null;
				draft.response = null;
				draft.stairsQuestion = null;
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
				draft.stairsQuestion = action.payload;
				draft.pending = false;
				break;
			case "finish":
				draft.pending = false;
				draft.canProceed = action.payload.canProceed;
				break;
		}
	}, initialState);
	const { nodes: portalNodes, addNode } = usePortal();
	const router = useRouter();
	const { addStage, clearStages, finishStage, stages } = useSummaryStage();
	const feedback = state.response ? getFeedback(state.response) : null;

	const goToQuestion = (question: StairsQuestion) => {
		console.log(question);
		const el = getChunkElement(question.chunk);
		if (el) {
			scrollToElement(el);

			setTimeout(() => {
				driverObj.highlight({
					element: el,
					popover: {
						description:
							"Please re-read the highlighted chunk. After re-reading, you will be asked a question to assess your understanding. When you are finished, press the 'return to summary' button",
						side: "left",
						align: "start",
					},
				});
			}, 1000);
		} else {
			toast.warning(
				"No question found, please revise your summary or move on to the next page",
			);
		}
	};

	useEffect(() => {
		driverObj.setConfig({
			smoothScroll: false,
			onPopoverRender: (popover) => {
				addNode(
					<ChatStairs user={user} pageSlug={pageSlug} onExit={exitQuestion} />,
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
	}, [feedbackType]);

	useEffect(() => {
		if (state.stairsQuestion && !state.isPassed && !state.error) {
			goToQuestion(state.stairsQuestion);
		}

		if (state.canProceed && !state.error) {
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

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
		dispatch({ type: "set_prev_input", payload: input });
		if (error) {
			dispatch({ type: "fail", payload: error });
			return;
		}

		const summaryCount = await countUserPageSummary(userId, pageSlug);
		const isEnoughSummary = summaryCount + 1 >= PAGE_SUMMARY_THRESHOLD;

		let summaryResponse: SummaryResponse | null = null;
		let stairsData: StairsQuestion | null = null;
		let requestBody = "";

		try {
			const focusTime = await findFocusTime(userId, pageSlug);
			requestBody = JSON.stringify({
				summary: input,
				page_slug: pageSlug,
				focus_time: focusTime?.data,
				chat_history: getChatHistory(messages),
				excluded_chunks: excludedChunks,
			});
			const response = await fetch(
				`${env.NEXT_PUBLIC_API_URL}/score/summary/stairs`,
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
				let stairsString: string | null = null;

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

							Sentry.captureMessage("SummaryResponse parse error", {
								extra: {
									body: requestBody,
									chunkString,
								},
							});
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
							stairsString = chunk.trim().replaceAll("\u0000", "");
						} else {
							if (stairsString) {
								stairsData = JSON.parse(stairsString) as StairsQuestion;
								finishStage("Analyzing");
								addStairsQuestion(stairsData);

								createEvent({
									eventType: "stairs-question",
									pageSlug,
									data: stairsData,
								});
							}
						}
					}

					chunkIndex++;
				}
			}

			if (summaryResponse) {
				addStage("Saving");
				await createSummary({
					text: input,
					pageSlug,
					response: summaryResponse,
				});

				if (summaryResponse.is_passed || isEnoughSummary) {
					await incrementUserPage(userId, pageSlug);
					dispatch({
						type: "finish",
						payload: { canProceed: !isLastPage(pageSlug) },
					});
				}
				finishStage("Saving");

				if (stairsData) {
					dispatch({ type: "ask", payload: stairsData });
				}
			}
		} catch (err) {
			console.log("summary scoring error", err);
			clearStages();
			dispatch({ type: "fail", payload: ErrorType.INTERNAL });

			Sentry.captureMessage("summary scoring error", {
				extra: {
					body: requestBody,
					summaryResponse: summaryResponse,
					stairsRespones: stairsData,
				},
			});
		}
	};

	const isPageFinished = useConstructedResponse(
		(state) => state.isPageFinished,
	);
	const editDisabled = pageStatus.isPageUnlocked ? false : !isPageFinished;

	return (
		<section className="space-y-2">
			{portalNodes}
			<div className="flex gap-2 items-center">
				{state.canProceed && page.nextPageSlug && (
					<PageLink
						pageSlug={page.nextPageSlug}
						className={buttonVariants({ variant: "outline" })}
					>
						Go to next page
					</PageLink>
				)}
				{state.stairsQuestion && (
					<Button
						variant={"outline"}
						onClick={() => goToQuestion(state.stairsQuestion as StairsQuestion)}
					>
						See question
					</Button>
				)}
			</div>

			{feedback && <SummaryFeedback feedback={feedback} />}

			<Confetti active={feedback?.isPassed || false} />
			<form className="mt-2 space-y-4" onSubmit={onSubmit}>
				<SummaryInput
					disabled={editDisabled || state.pending}
					pageSlug={pageSlug}
					pending={state.pending}
					stages={stages}
				/>
				{state.error && <Warning>{ErrorFeedback[state.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton
						// disabled={!isPageFinished}
						disabled={false}
						pending={state.pending}
					/>
				</div>
			</form>
		</section>
	);
};

"use client";

import { createEventAction } from "@/actions/event";
import { getFocusTimeAction } from "@/actions/focus-time";
import { createSummaryAction } from "@/actions/summary";
import { useChat, useQuestion } from "@/components/provider/page-provider";
import {
	useSession,
	useSessionAction,
} from "@/components/provider/session-provider";
import { Condition, Elements } from "@/lib/constants";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { getChatHistory } from "@/lib/store/chat";
import {
	PageData,
	getChunkElement,
	makePageHref,
	reportSentry,
	scrollToElement,
} from "@/lib/utils";
import {
	useDebounce,
	useKeystroke,
	usePortal,
	useTimer,
} from "@itell/core/hooks";
import {
	ErrorFeedback,
	ErrorType,
	SummaryResponse,
	SummaryResponseSchema,
	validateSummary,
} from "@itell/core/summary";
import { SummaryFeedback as SummaryFeedbackType } from "@itell/core/summary";
import { Button, StatusButton } from "@itell/ui/client";
import { Warning } from "@itell/ui/server";
import { ChatStairs } from "@textbook/chat-stairs";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { User } from "lucia";
import { FileQuestionIcon, SendHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import { useImmerReducer } from "use-immer";
import { SummaryFeedback } from "./summary-feedback";
import {
	SummaryInput,
	getSummaryLocal,
	saveSummaryLocal,
} from "./summary-input";
import { NextPageButton } from "./summary-next-page-button";

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
	prevInput: string | undefined;
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
	| { type: "set_prev_input"; payload: string };

const driverObj = driver();

const getFeedback = (response: SummaryResponse): SummaryFeedbackType => {
	return {
		isPassed: response.is_passed || false,
		prompt: response.prompt || "",
		promptDetails: response.prompt_details || [],
		suggestedKeyphrases: response.suggested_keyphrases,
	};
};

const exitQuestion = () => {
	const summaryEl = document.getElementById(Elements.PAGE_ASSIGNMENTS);

	driverObj.destroy();

	if (summaryEl) {
		scrollToElement(summaryEl as HTMLDivElement);
	}
};

const goToQuestion = (question: StairsQuestion) => {
	const el = getChunkElement(question.chunk);
	if (el) {
		scrollToElement(el);

		driverObj.highlight({
			element: el,
			popover: {
				description:
					"Please re-read the highlighted section. After re-reading, you will be asked a question to assess your understanding. When you are finished, press the 'return to summary' button",
			},
		});
	} else {
		toast.warning(
			"No question found, please revise your summary or move on to the next page",
		);
	}
};

export const SummaryFormStairs = ({ user, page, pageStatus }: Props) => {
	const { ref, data: keystrokes, clear: clearKeystroke } = useKeystroke();
	const submitButtonRef = useRef<HTMLButtonElement | null>(null);
	const initialState: State = {
		prevInput: undefined,
		error: null,
		response: null,
		stairsQuestion: null,
		canProceed: pageStatus.unlocked,
	};
	const { updateUser } = useSessionAction();
	const session = useSession();
	const isTextbookFinished = session.user?.finished || false;

	const pageSlug = page.page_slug;
	const { stairsAnswered, addStairsQuestion, messages } = useChat((state) => {
		return {
			stairsAnswered: state.stairsAnswered,
			addStairsQuestion: state.addStairsQuestion,
			messages: state.stairsMessages,
		};
	});
	const getExcludedChunks = useQuestion((state) => state.getExcludedChunks);
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
	const isSummaryReady = useQuestion((state) => state.isSummaryReady);
	const router = useRouter();
	const { addStage, clearStages, finishStage, stages } = useSummaryStage();
	const feedback = state.response ? getFeedback(state.response) : null;

	const requestBodyRef = useRef<string | null>(null);
	const summaryResponseRef = useRef<SummaryResponse | null>(null);
	const stairsDataRef = useRef<StairsQuestion | null>(null);

	useEffect(() => {
		driverObj.setConfig({
			smoothScroll: false,
			animate: false,
			onPopoverRender: (popover) => {
				addNode(
					<ChatStairs
						userImage={user.image}
						userName={user.name}
						pageSlug={pageSlug}
						RenderFooter={() => (
							<FinishReadingButton
								onClick={(time) => {
									exitQuestion();
									if (!stairsAnswered) {
										createEventAction({
											type: Condition.STAIRS,
											pageSlug,
											data: { stairs: stairsDataRef.current, time },
										});
									}
								}}
							/>
						)}
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
	}, [stairsAnswered]);

	const {
		action,
		isPending: _isPending,
		isDelayed,
		isError,
		error,
	} = useActionStatus(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (submitButtonRef) {
				submitButtonRef.current?.blur();
			}

			clearStages();
			dispatch({ type: "submit" });
			addStage("Scoring");

			const formData = new FormData(e.currentTarget);
			const input = String(formData.get("input")).replaceAll("\u0000", "");

			saveSummaryLocal(pageSlug, input);

			const error = validateSummary(input, state.prevInput);

			if (error) {
				dispatch({ type: "fail", payload: error });
				return;
			}

			// set prev input here so we are not comparing consecutive error summaries
			dispatch({ type: "set_prev_input", payload: input });

			const [focusTime, err] = await getFocusTimeAction({ pageSlug });
			if (err) {
				throw new Error(err.message);
			}
			const body = JSON.stringify({
				summary: input,
				page_slug: pageSlug,
				focus_time: focusTime?.data,
				chat_history: getChatHistory(messages),
				excluded_chunks: getExcludedChunks(),
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

				const [data, err] = await createSummaryAction({
					summary: {
						text: input,
						pageSlug,
						condition: Condition.STAIRS,
						isPassed: scores.is_passed || false,
						containmentScore: scores.containment,
						similarityScore: scores.similarity,
						languageScore: scores.language,
						contentScore: scores.content,
					},
					keystroke: {
						start: state.prevInput
							? state.prevInput
							: getSummaryLocal(pageSlug) || "",
						data: keystrokes,
					},
				});
				if (err) {
					throw new Error(err.message);
				}

				clearKeystroke();
				finishStage("Saving");

				if (data.canProceed) {
					if (isLastPage(pageSlug)) {
						updateUser({ finished: true });
						toast.info(
							"You have finished the entire textbook! Please use the survey code to access the outtake survey.",
						);
					} else {
						updateUser({ pageSlug: data.nextPageSlug });
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
												router.push(makePageHref(page.nextPageSlug as string));
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
					if (!data.canProceed && !pageStatus.unlocked) {
						goToQuestion(stairsDataRef.current);
					}
				}
			}
		},
		{ delayTimeout: 20000 },
	);

	const isPending = useDebounce(_isPending, 100);

	useEffect(() => {
		if (isError) {
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
		<div className="flex flex-col gap-2">
			{portalNodes}

			{feedback && (
				<SummaryFeedback
					className={isPending ? "opacity-70" : ""}
					feedback={feedback}
					needRevision={
						isLastPage(pageSlug) ? isTextbookFinished : state.canProceed
					}
				/>
			)}

			<div className="flex gap-2 items-center">
				{state.canProceed && page.nextPageSlug && (
					<NextPageButton pageSlug={page.nextPageSlug} />
				)}
				{state.stairsQuestion && (
					<Button
						variant={"outline"}
						onClick={() => goToQuestion(state.stairsQuestion as StairsQuestion)}
					>
						<span className="flex items-center gap-2">
							<FileQuestionIcon className="size-4" />
							See question
						</span>
					</Button>
				)}
			</div>

			<Confetti active={feedback?.isPassed || false} />
			<h2 id="summary-form-heading" className="sr-only">
				submit summary
			</h2>
			<form
				className="mt-2 space-y-4"
				onSubmit={action}
				aria-labelledby="summary-form-heading"
				aria-disabled={!isSummaryReady || isPending}
			>
				<SummaryInput
					disabled={!isSummaryReady}
					pageSlug={pageSlug}
					pending={isPending}
					stages={stages}
					userRole={user.role}
					ref={ref}
				/>
				{state.error && <Warning>{ErrorFeedback[state.error]}</Warning>}
				<div className="flex justify-end">
					<StatusButton
						disabled={!isSummaryReady}
						pending={isPending}
						className="w-32"
						ref={submitButtonRef}
					>
						<span className="flex items-center gap-2">
							<SendHorizontalIcon className="size-4" />
							Submit
						</span>
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
		</div>
	);
};

const FinishReadingButton = ({
	onClick,
}: { onClick: (val: number) => void }) => {
	const stairsAnswered = useChat((store) => store.stairsAnswered);
	const { time, clearTimer } = useTimer();

	if (!stairsAnswered) {
		return null;
	}

	return (
		<div className="flex justify-end mt-4">
			<Button
				size="sm"
				onClick={() => {
					onClick(time);
					clearTimer();
				}}
			>
				Return to summary
			</Button>
		</div>
	);
};

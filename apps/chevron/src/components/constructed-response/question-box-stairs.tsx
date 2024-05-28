"use client";

import { Confetti } from "@/components/ui/confetti";
import { useSession } from "@/lib/auth/context";
import { isProduction } from "@/lib/constants";
import { createConstructedResponse } from "@/lib/constructed-response/actions";
import { Condition } from "@/lib/control/condition";
import { PageStatus } from "@/lib/page-status";
import { getQAScore } from "@/lib/question";
// import shake effect
import "@/styles/shakescreen.css";
import { cn } from "@itell/core/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	Warning,
} from "@itell/ui/server";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, KeyRoundIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { LoginButton } from "../auth/auth-form";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	TextArea,
} from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";
import { ExplainButton } from "./explain-button";
import { NextChunkButton } from "./next-chunk-button";
import { QuestionFeedback } from "./question-feedback";
import { SubmitButton } from "./submit-button";
import { AnswerStatusStairs, QuestionScore, borderColors } from "./types";

type Props = {
	question: string;
	answer: string;
	chunkSlug: string;
	pageSlug: string;
	pageStatus: PageStatus;
};

type FormState = {
	answerStatus: AnswerStatusStairs;
	error: string | null;
	prevInput: string;
};

export const QuestionBoxStairs = ({
	question,
	answer,
	chunkSlug,
	pageSlug,
	pageStatus,
}: Props) => {
	const { user } = useSession();
	const [show, setShow] = useState(!pageStatus.isPageUnlocked);
	const { chunks, isPageFinished, finishChunk } = useConstructedResponse(
		(state) => ({
			chunks: state.chunks,
			isPageFinished: state.isPageFinished,
			finishChunk: state.finishChunk,
		}),
	);

	const [isShaking, setIsShaking] = useState(false);
	const [isNextButtonDisplayed, setIsNextButtonDisplayed] = useState(
		!isPageFinished,
	);

	// Function to trigger the shake animation
	const shakeModal = () => {
		setIsShaking(true);

		// Reset the shake animation after a short delay
		setTimeout(() => {
			setIsShaking(false);
		}, 400);
	};

	const action = async (
		prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		if (!user) {
			return {
				...prevState,
				error: "You need to be logged in to answer this question",
			};
		}
		const input = String(formData.get("input")).trim();
		if (input.length === 0) {
			return {
				...prevState,
				error: "Answer cannot be empty",
			};
		}

		if (input === prevState.prevInput) {
			return {
				...prevState,
				error: "Please submit a different answer",
			};
		}

		try {
			const response = await getQAScore({
				input,
				chunk_slug: chunkSlug,
				page_slug: pageSlug,
			});

			if (!response.success) {
				// API response is not in correct shape
				console.error("API Response error", response);
				return {
					...prevState,
					answerStatus: AnswerStatusStairs.PASSED,
					error: "Answer evaluation failed, please try again later",
				};
			}

			const score = response.data.score as QuestionScore;
			createConstructedResponse({
				text: input,
				userId: user.id,
				chunkSlug,
				pageSlug,
				score,
				condition: Condition.STAIRS,
			});

			// if answer is correct, mark chunk as finished
			// this will add the chunk to the list of finished chunks that gets excluded from stairs question
			if (score === 2) {
				finishChunk(chunkSlug);

				return {
					error: null,
					answerStatus: AnswerStatusStairs.BOTH_CORRECT,
					prevInput: input,
				};
			}

			if (score === 1) {
				return {
					error: null,
					answerStatus: AnswerStatusStairs.SEMI_CORRECT,
					prevInput: input,
				};
			}

			if (score === 0) {
				return {
					error: null,
					answerStatus: AnswerStatusStairs.BOTH_INCORRECT,
					prevInput: input,
				};
			}

			// for typing purposes, this should never run
			return prevState;
		} catch (err) {
			console.log("constructed response evaluation error", err);
			Sentry.captureMessage("constructed response scoring error", {
				extra: {
					pageSlug,
					chunkSlug,
					input,
				},
			});
			return {
				error: "Answer evaluation failed, please try again later",
				answerStatus: prevState.answerStatus,
				prevInput: input,
			};
		}
	};

	const initialFormState: FormState = {
		answerStatus: AnswerStatusStairs.UNANSWERED,
		error: null,
		prevInput: "",
	};

	const [formState, formAction] = useFormState(action, initialFormState);
	const answerStatus = formState.answerStatus;

	const borderColor = borderColors[answerStatus];

	useEffect(() => {
		if (formState.error) {
			toast.warning(formState.error);
		}

		if (
			formState.answerStatus === AnswerStatusStairs.BOTH_CORRECT ||
			formState.answerStatus === AnswerStatusStairs.PASSED
		) {
			setIsNextButtonDisplayed(true);
		}

		if (formState.answerStatus === AnswerStatusStairs.BOTH_INCORRECT) {
			shakeModal();
		}
	}, [formState]);

	const isLastQuestion = chunkSlug === chunks.at(-1);
	const nextButtonText = isLastQuestion
		? "Unlock summary"
		: answerStatus === AnswerStatusStairs.BOTH_INCORRECT
			? "Skip this question"
			: "Continue reading";

	if (!user) {
		return (
			<Warning>
				<p>You need to be logged in to view this question and move forward</p>
				<LoginButton />
			</Warning>
		);
	}

	if (!show) {
		return (
			<Button variant={"outline"} onClick={() => setShow(true)}>
				Reveal optional question
			</Button>
		);
	}

	return (
		<>
			<Card
				className={cn(
					"flex justify-center items-center flex-col py-4 px-6 space-y-2",
					`${borderColor}`,
					`${isShaking ? "shake" : ""}`,
				)}
			>
				<Confetti active={answerStatus === AnswerStatusStairs.BOTH_CORRECT} />

				<CardHeader className="flex flex-row justify-center items-baseline w-full p-2 gap-1">
					<CardDescription className="flex justify-center items-center font-light text-zinc-500 w-10/12 mr-4 text-xs">
						{" "}
						<AlertTriangle className="stroke-yellow-400 mr-4" /> iTELL AI is in
						alpha testing. It will try its best to help you but it can still
						make mistakes. Let us know how you feel about iTELL AI's performance
						using the feedback icons to the right (thumbs up or thumbs down).{" "}
					</CardDescription>
					<QuestionFeedback
						type="positive"
						pageSlug={pageSlug}
						chunkSlug={chunkSlug}
						userId={user.id}
					/>
					<QuestionFeedback
						type="negative"
						pageSlug={pageSlug}
						chunkSlug={chunkSlug}
						userId={user.id}
					/>
				</CardHeader>

				<CardContent className="flex flex-col justify-center items-center space-y-4 w-4/5 mx-auto">
					{answerStatus === AnswerStatusStairs.BOTH_INCORRECT && (
						<div className="text-xs">
							<p className="text-red-400 question-box-text">
								<b>iTELL AI says:</b> You likely got a part of the answer wrong.
								Please try again.
							</p>
							<p className="question-box-text underline">
								{isLastQuestion
									? 'If you believe iTELL AI has made an error, you can click on the "Unlock summary" button to skip this question and start writing a summary.'
									: 'If you believe iTELL AI has made an error, you can click on the "Skip this question" button to skip this question.'}
							</p>
						</div>
					)}

					{answerStatus === AnswerStatusStairs.SEMI_CORRECT && (
						<p className="text-yellow-600 question-box-text text-xs">
							<b>iTELL AI says:</b> You may have missed something, but you were
							generally close. You can click on the "Continue reading" button
							below go to the next part or try again with a different response.{" "}
						</p>
					)}

					{answerStatus === AnswerStatusStairs.BOTH_CORRECT ? (
						<div className="flex items-center flex-col">
							<p className="text-xl2 text-emerald-600 text-center">
								Your answer is correct!
							</p>
							{!isPageFinished && (
								<p className="text-sm">
									Click on the button below to continue reading. Please use the
									thumbs-up or thumbs-down icons on the top right side of this
									box if you have any feedback about this question that you
									would like to provide before you continue reading.
								</p>
							)}
						</div>
					) : (
						question && (
							<p>
								<span className="font-bold">Question </span>
								{pageStatus.isPageUnlocked && (
									<span className="font-bold">(Optional)</span>
								)}
								: {question}
							</p>
						)
					)}

					<form action={formAction} className="w-full space-y-2">
						<TextArea
							name="input"
							rows={2}
							className="max-w-lg mx-auto rounded-md shadow-md p-4"
							onPaste={(e) => {
								if (isProduction) {
									e.preventDefault();
									toast.warning("Copy & Paste is not allowed for question");
								}
							}}
						/>
						<div className="flex flex-col sm:flex-row justify-center items-center gap-2">
							{answerStatus !== AnswerStatusStairs.UNANSWERED && (
								<HoverCard>
									<HoverCardTrigger asChild>
										<Button variant={"outline"} type="button">
											<KeyRoundIcon className="size-4 mr-2" />
											Reveal Answer
										</Button>
									</HoverCardTrigger>
									<HoverCardContent className="w-80">
										<p className="leading-relaxed">{answer}</p>
									</HoverCardContent>
								</HoverCard>
							)}

							{answerStatus === AnswerStatusStairs.BOTH_CORRECT &&
							isNextButtonDisplayed ? (
								// when answer is all correct and next button should be displayed
								<NextChunkButton
									pageSlug={pageSlug}
									clickEventType="post-question chunk reveal"
									onClick={() => setIsNextButtonDisplayed(false)}
									chunkSlug={chunkSlug}
								>
									{nextButtonText}
								</NextChunkButton>
							) : (
								// when answer is not all correct
								<>
									{formState.answerStatus !==
										AnswerStatusStairs.BOTH_CORRECT && (
										<SubmitButton
											answered={answerStatus !== AnswerStatusStairs.UNANSWERED}
										/>
									)}

									{answerStatus !== AnswerStatusStairs.UNANSWERED &&
										isNextButtonDisplayed && (
											<NextChunkButton
												pageSlug={pageSlug}
												chunkSlug={chunkSlug}
												clickEventType="post-question chunk reveal"
												onClick={() => setIsNextButtonDisplayed(false)}
											>
												{nextButtonText}
											</NextChunkButton>
										)}
								</>
							)}
						</div>
						<div className="flex items-center justify-center mt-4">
							{answerStatus === AnswerStatusStairs.SEMI_CORRECT ||
								(answerStatus === AnswerStatusStairs.BOTH_INCORRECT && (
									<ExplainButton chunkSlug={chunkSlug} pageSlug={pageSlug} />
								))}
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
};

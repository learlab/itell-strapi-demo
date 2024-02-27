"use client";

import { Confetti } from "@/components/ui/confetti";
import { isProduction } from "@/lib/constants";
import { getQAScore } from "@/lib/question";
import { createConstructedResponse } from "@/lib/server-actions";
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
import { AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	TextArea,
} from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";
import { Spinner } from "../spinner";
import { FeedbackModal } from "./feedback-modal";
import { NextChunkButton } from "./next-chunk-button";

type QuestionScore = 0 | 1 | 2;

type Props = {
	question: string;
	answer: string;
	chunkSlug: string;
	pageSlug: string;
	isFeedbackEnabled: boolean;
};

// state for answer correctness
enum AnswerStatus {
	UNANSWERED = 0,
	BOTH_CORRECT = 1,
	SEMI_CORRECT = 2,
	BOTH_INCORRECT = 3,
	PASSED = 4, // fallback when api call fails
}

// state for border color
enum BorderColor {
	BLUE = "border-blue-400",
	RED = "border-red-400",
	GREEN = "border-green-400",
	YELLOW = "border-yellow-400",
}

type FormState = {
	answerStatus: AnswerStatus;
	error: string | null;
};

const SubmitButton = ({ answerStatus }: { answerStatus: AnswerStatus }) => {
	const { pending } = useFormStatus();

	return (
		<Button variant="secondary" disabled={pending}>
			{pending && <Spinner className="inline mr-2" />}
			{answerStatus === AnswerStatus.UNANSWERED ? "Answer" : "Resubmit"}
		</Button>
	);
};

export const QuestionBox = ({
	question,
	answer,
	chunkSlug,
	pageSlug,
	isFeedbackEnabled,
}: Props) => {
	const { data: session } = useSession();
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
		const input = formData.get("input") as string;
		if (input.trim() === "") {
			return {
				...prevState,
				error: "Answer cannot be empty",
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
					answerStatus: AnswerStatus.PASSED,
					error: "Answer evaluation failed, please try again later",
				};
			}

			const score = response.data.score as QuestionScore;
			if (isProduction) {
				// when there is no session, question won't be displayed
				await createConstructedResponse({
					response: input,
					chunkSlug,
					pageSlug,
					score,
				});
			}

			if (score === 2) {
				finishChunk(chunkSlug);

				return {
					error: null,
					answerStatus: AnswerStatus.BOTH_CORRECT,
				};
			}

			if (score === 1) {
				return {
					error: null,
					answerStatus: AnswerStatus.SEMI_CORRECT,
				};
			}

			if (score === 0) {
				return {
					error: null,
					answerStatus: AnswerStatus.BOTH_INCORRECT,
				};
			}

			// for typing purposes, this should never run
			return prevState;
		} catch (err) {
			console.log("constructed response evaluation error", err);
			return {
				error: "Answer evaluation failed, please try again later",
				answerStatus: prevState.answerStatus,
			};
		}
	};

	const initialFormState: FormState = {
		answerStatus: AnswerStatus.UNANSWERED,
		error: null,
	};

	const [formState, formAction] = useFormState(action, initialFormState);
	const answerStatus = formState.answerStatus;

	const borderColor =
		formState.answerStatus === AnswerStatus.UNANSWERED
			? BorderColor.BLUE
			: formState.answerStatus === AnswerStatus.BOTH_CORRECT
			  ? BorderColor.GREEN
			  : formState.answerStatus === AnswerStatus.SEMI_CORRECT
				  ? BorderColor.YELLOW
				  : BorderColor.RED;

	useEffect(() => {
		if (formState.error) {
			toast.warning(formState.error);
		}

		if (formState.answerStatus === AnswerStatus.BOTH_CORRECT) {
			setIsNextButtonDisplayed(true);
		}

		if (formState.answerStatus === AnswerStatus.BOTH_INCORRECT) {
			shakeModal();
		}
	}, [formState]);

	const isLastQuestion = chunkSlug === chunks[chunks.length - 1];
	const nextButtonText = isLastQuestion
		? "Unlock summary"
		: answerStatus === AnswerStatus.BOTH_CORRECT ||
			  answerStatus === AnswerStatus.SEMI_CORRECT
		  ? "Continue reading"
		  : "Skip this question";

	if (!session?.user) {
		return (
			<Warning>
				You need to be logged in to view this question and move forward
			</Warning>
		);
	}

	if (!isFeedbackEnabled) {
		return (
			<Card
				className={cn(
					"flex justify-center items-center flex-col py-4 px-6 space-y-2",
				)}
			>
				<CardContent className="flex flex-col justify-center items-center space-y-4 w-4/5 mx-auto">
					{answerStatus !== AnswerStatus.UNANSWERED ? (
						<div className="flex items-center flex-col">
							<p className="text-xl2 text-emerald-600 text-center">
								Your answer was accepted
							</p>
							{!isPageFinished && (
								<p className="text-sm">
									Click on the button below to continue reading.
								</p>
							)}
						</div>
					) : (
						question && (
							<p>
								<b>Question:</b> {question}
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
							{answerStatus === AnswerStatus.UNANSWERED ? (
								<SubmitButton answerStatus={answerStatus} />
							) : (
								isNextButtonDisplayed && (
									<NextChunkButton
										pageSlug={pageSlug}
										chunkSlug={chunkSlug}
										clickEventType="post-question chunk reveal"
										onClick={() => setIsNextButtonDisplayed(false)}
									>
										{nextButtonText}
									</NextChunkButton>
								)
							)}
						</div>
					</form>
				</CardContent>
			</Card>
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
				<Confetti
					active={
						answerStatus === AnswerStatus.BOTH_CORRECT && isFeedbackEnabled
					}
				/>

				<CardHeader className="flex flex-row justify-center items-baseline w-full p-2 gap-1">
					<CardDescription className="question-box-text flex justify-center items-center font-light text-zinc-500 w-10/12 mr-4 text-xs">
						{" "}
						<AlertTriangle className="stroke-yellow-400 mr-4" /> iTELL AI is in
						alpha testing. It will try its best to help you but it can still
						make mistakes. Let us know how you feel about iTELL AI's performance
						using the feedback icons to the right (thumbs up or thumbs down).{" "}
					</CardDescription>
					<FeedbackModal
						type="positive"
						pageSlug={pageSlug}
						chunkSlug={chunkSlug}
					/>
					<FeedbackModal
						type="negative"
						pageSlug={pageSlug}
						chunkSlug={chunkSlug}
					/>
				</CardHeader>

				<CardContent className="flex flex-col justify-center items-center space-y-4 w-4/5 mx-auto">
					{answerStatus === AnswerStatus.BOTH_INCORRECT && (
						<div className="text-xs">
							<p className="question-box-text text-red-400">
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

					{answerStatus === AnswerStatus.SEMI_CORRECT && (
						<p className="text-yellow-600 question-box-text text-xs">
							<b>iTELL AI says:</b> You may have missed something, but you were
							generally close. You can click on the "Continue reading" button
							below go to the next part or try again with a different response.{" "}
						</p>
					)}

					{answerStatus === AnswerStatus.BOTH_CORRECT ? (
						<div className="flex items-center flex-col">
							<p className="text-xl2 text-emerald-600 text-center">
								Your answer was Correct!
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
							<p className="question-box-text">
								<span className="font-semibold">Question: </span> {question}
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
							{answerStatus !== AnswerStatus.UNANSWERED && (
								<HoverCard>
									<HoverCardTrigger asChild>
										<Button variant="secondary" type="button">
											Reveal Answer
										</Button>
									</HoverCardTrigger>
									<HoverCardContent className="w-80">
										<p className="leading-relaxed">{answer}</p>
									</HoverCardContent>
								</HoverCard>
							)}
							{answerStatus === AnswerStatus.BOTH_CORRECT &&
							isNextButtonDisplayed ? (
								<NextChunkButton
									pageSlug={pageSlug}
									clickEventType="post-question chunk reveal"
									onClick={() => setIsNextButtonDisplayed(false)}
									chunkSlug={chunkSlug}
								>
									{nextButtonText}
								</NextChunkButton>
							) : (
								<>
									{formState.answerStatus !== AnswerStatus.BOTH_CORRECT && (
										<SubmitButton answerStatus={answerStatus} />
									)}

									{answerStatus !== AnswerStatus.UNANSWERED &&
										isNextButtonDisplayed && (
											<NextChunkButton
												pageSlug={pageSlug}
												chunkSlug={chunkSlug}
												clickEventType="post-question chunk reveal"
												variant="ghost"
												onClick={() => setIsNextButtonDisplayed(false)}
											>
												{nextButtonText}
											</NextChunkButton>
										)}
								</>
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
};

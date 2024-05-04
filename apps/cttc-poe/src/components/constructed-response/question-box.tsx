"use client";

import { Confetti } from "@/components/ui/confetti";
import { env } from "@/env.mjs";
import { isProduction } from "@/lib/constants";
import { createConstructedResponse } from "@/lib/constructed-response/actions";
import { getQAScore } from "@/lib/question";
import { FeedbackType } from "@/lib/store/config";
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
import {
	AlertTriangle,
	HelpCircleIcon,
	KeyRoundIcon,
	PencilIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { GoogleLoginButton } from "../auth/login-buttons";
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
	feedbackType: FeedbackType;
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
		<Button
			type="submit"
			disabled={pending}
			className="gap-2"
			variant={"outline"}
		>
			{pending ? (
				<Spinner className="size-4" />
			) : (
				<PencilIcon className="size-4" />
			)}
			{answerStatus === AnswerStatus.UNANSWERED ? "Answer" : "Resubmit"}
		</Button>
	);
};

const ExplainButton = ({
	pageSlug,
	chunkSlug,
}: { pageSlug: string; chunkSlug: string }) => {
	const [input, setInput] = useState("");
	const [response, setResponse] = useState("");
	const { pending, data } = useFormStatus();
	const [loading, setLoading] = useState(false);
	const isPending = pending || loading;

	const onClick = async () => {
		setLoading(true);
		const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/chat/CRI`, {
			method: "POST",
			body: JSON.stringify({
				page_slug: pageSlug,
				chunk_slug: chunkSlug,
				student_response: input,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.body) {
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let done = false;
			while (!done) {
				const { value, done: done_ } = await reader.read();
				done = done_;
				const chunk = decoder.decode(value);
				if (chunk) {
					const chunkValue = JSON.parse(chunk.trim().split("\u0000")[0]) as {
						request_id: string;
						text: string;
					};

					if (chunkValue) {
						setResponse(chunkValue.text);
					}
				}
			}
		}

		setLoading(false);
	};

	useEffect(() => {
		if (data) {
			setInput(String(data.get("input")));
		}
	}, [data]);

	return (
		<div className="flex flex-col items-center justify-center">
			{response && <p className="text-sm text-muted-foreground">{response}</p>}
			<Button
				variant="secondary"
				className="gap-2"
				type="button"
				disabled={isPending}
				onClick={onClick}
			>
				{isPending ? (
					<Spinner className="size-4" />
				) : (
					<HelpCircleIcon className="size-4" />
				)}
				What's wrong with my answer?
			</Button>
		</div>
	);
};

export const QuestionBox = ({
	question,
	answer,
	chunkSlug,
	pageSlug,
	feedbackType,
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
			await createConstructedResponse({
				response: input,
				chunkSlug,
				pageSlug,
				score,
			});

			// if answer is correct, mark chunk as finished
			// this will add the chunk to the list of finished chunks that gets excluded from stairs question
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

	const isLastQuestion = chunkSlug === chunks.at(-1);
	const nextButtonText = isLastQuestion
		? "Unlock summary"
		: answerStatus === AnswerStatus.BOTH_CORRECT ||
			  answerStatus === AnswerStatus.SEMI_CORRECT
		  ? "Continue reading"
		  : "Skip this question";

	if (!session?.user) {
		return (
			<Warning>
				<p>You need to be logged in to view this question and move forward</p>
				<GoogleLoginButton />
			</Warning>
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
						answerStatus === AnswerStatus.BOTH_CORRECT &&
						feedbackType === "stairs"
					}
				/>

				<CardHeader className="flex flex-row justify-center items-baseline w-full p-2 gap-1">
					<CardDescription className="flex justify-center items-center font-light text-zinc-500 w-10/12 mr-4 text-xs">
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
							{answerStatus !== AnswerStatus.UNANSWERED && (
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

							{answerStatus === AnswerStatus.BOTH_CORRECT &&
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
						<div className="flex items-center justify-center mt-4">
							{answerStatus === AnswerStatus.SEMI_CORRECT ||
								(answerStatus === AnswerStatus.BOTH_INCORRECT && (
									<ExplainButton chunkSlug={chunkSlug} pageSlug={pageSlug} />
								))}
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
};

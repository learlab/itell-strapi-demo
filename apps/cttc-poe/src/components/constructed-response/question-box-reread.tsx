"use client";

import { isProduction } from "@/lib/constants";
import { createConstructedResponse } from "@/lib/constructed-response/actions";
import { getQAScore } from "@/lib/question";
import { cn } from "@itell/core/utils";
import { Card, CardContent, Warning } from "@itell/ui/server";
import * as Sentry from "@sentry/nextjs";
import { KeyRoundIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
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
import { NextChunkButton } from "./next-chunk-button";
import { SubmitButton } from "./submit-button";
import { AnswerStatusReread } from "./types";

type QuestionScore = 0 | 1 | 2;

type Props = {
	question: string;
	answer: string;
	chunkSlug: string;
	pageSlug: string;
};

type FormState = {
	answerStatus: AnswerStatusReread;
	error: string | null;
};

export const QuestionBoxReread = ({
	question,
	answer,
	chunkSlug,
	pageSlug,
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
					answerStatus: AnswerStatusReread.UNANSWERED,
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

			finishChunk(chunkSlug);
			return {
				answerStatus: AnswerStatusReread.ANSWERED,
				error: null,
			};
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
		answerStatus: AnswerStatusReread.UNANSWERED,
		error: null,
	};

	const [formState, formAction] = useFormState(action, initialFormState);
	const answerStatus = formState.answerStatus;

	useEffect(() => {
		if (formState.error) {
			toast.warning(formState.error);
		}

		if (formState.answerStatus === AnswerStatusReread.ANSWERED) {
			setIsNextButtonDisplayed(true);
		}
	}, [formState]);

	const isLastQuestion = chunkSlug === chunks.at(-1);
	const nextButtonText = isLastQuestion ? "Unlock summary" : "Continue reading";

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
					answerStatus === AnswerStatusReread.ANSWERED
						? "border-2 border-border"
						: "",
				)}
			>
				<CardContent className="flex flex-col justify-center items-center space-y-4 w-4/5 mx-auto">
					{question && (
						<p>
							<b>Question:</b> {question}
						</p>
					)}
					{answerStatus === AnswerStatusReread.ANSWERED && (
						<p className="text-sm text-muted-foreground">
							Thanks for completing this question. You can move on to the next
							section or refine your answer.
						</p>
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
							{answerStatus === AnswerStatusReread.ANSWERED && (
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

							<SubmitButton
								answered={answerStatus === AnswerStatusReread.ANSWERED}
							/>

							{isNextButtonDisplayed && (
								<NextChunkButton
									pageSlug={pageSlug}
									clickEventType="post-question chunk reveal"
									onClick={() => setIsNextButtonDisplayed(false)}
									chunkSlug={chunkSlug}
								>
									{nextButtonText}
								</NextChunkButton>
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
};

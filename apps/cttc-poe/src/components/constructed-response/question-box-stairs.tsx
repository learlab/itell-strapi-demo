"use client";

import { Confetti } from "@/components/ui/confetti";
import { isProduction } from "@/lib/constants";
import { createConstructedResponse } from "@/lib/constructed-response/actions";
import { Condition } from "@/lib/control/condition";
import { getQAScore } from "@/lib/question";
import { reportSentry } from "@/lib/utils";
import { LoginButton } from "@auth//auth-form";
import { cn } from "@itell/utils";

import { Button } from "@itell/ui/button";
import { Warning } from "@itell/ui/callout";
import { Card, CardContent, CardDescription, CardHeader } from "@itell/ui/card";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@itell/ui/hover-card";
import { TextArea } from "@itell/ui/textarea";
import { AlertTriangle, KeyRoundIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useConstructedResponse } from "../provider/page-provider";
import { ExplainButton } from "./explain-button";
import { FinishQuestionButton } from "./finish-question-button";
import { QuestionFeedback } from "./question-feedback";
import { SubmitButton } from "./submit-button";
import { AnswerStatusStairs, QuestionScore, borderColors } from "./types";

type Props = {
	userId: string | null;
	question: string;
	answer: string;
	chunkSlug: string;
	pageSlug: string;
};

type FormState = {
	answerStatus: AnswerStatusStairs;
	error: string | null;
	prevInput: string;
};

export const QuestionBoxStairs = ({
	userId,
	question,
	answer,
	chunkSlug,
	pageSlug,
}: Props) => {
	const ref = useRef<HTMLDivElement>(null);

	const [input, setInput] = useState("");
	const { chunkSlugs, shouldBlur, finishChunk } = useConstructedResponse(
		(state) => ({
			chunkSlugs: state.chunkSlugs,
			shouldBlur: state.shouldBlur,
			finishChunk: state.finishChunk,
		}),
	);
	const [show, setShow] = useState(shouldBlur);

	const action = async (
		prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		if (!userId) {
			return {
				...prevState,
				error: "You need to be logged in to answer this question",
			};
		}
		const input = String(formData.get("input")).trim();
		setInput(input);
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
				userId,
				chunkSlug,
				pageSlug,
				score,
				text: input,
				condition: Condition.STAIRS,
			});

			// if answer is correct, mark chunk as finished
			// this will add the chunk to the list of finished chunks that gets excluded from stairs question
			if (score === 2) {
				finishChunk(chunkSlug, true);

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
				ref.current?.classList.add("shake");

				return {
					error: null,
					answerStatus: AnswerStatusStairs.BOTH_INCORRECT,
					prevInput: input,
				};
			}

			// for typing purposes, this should never run
			return prevState;
		} catch (err) {
			reportSentry("score cr stairs", {
				pageSlug,
				chunkSlug,
				input,
				error: err,
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
	const isNextButtonDisplayed =
		shouldBlur && answerStatus !== AnswerStatusStairs.UNANSWERED;

	const borderColor = borderColors[answerStatus];

	useEffect(() => {
		if (formState.error) {
			toast.warning(formState.error);
		}
	}, [formState]);

	const isLastQuestion = chunkSlug === chunkSlugs.at(-1);

	if (!userId) {
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
		<Card
			className={cn(
				"flex justify-center items-center flex-col py-4 px-6 space-y-2 animate-in fade-in zoom-10",
				`${borderColor}`,
			)}
			ref={ref}
		>
			<Confetti active={answerStatus === AnswerStatusStairs.BOTH_CORRECT} />

			<CardHeader className="flex flex-row justify-center items-baseline w-full p-2 gap-1">
				<CardDescription className="flex justify-center items-center font-light text-zinc-500 w-10/12 mr-4 text-xs">
					{" "}
					<AlertTriangle className="stroke-yellow-400 mr-4" /> iTELL AI is in
					alpha testing. It will try its best to help you but it can still make
					mistakes. Let us know how you feel about iTELL AI's performance using
					the feedback icons to the right (thumbs up or thumbs down).{" "}
				</CardDescription>
				<QuestionFeedback
					type="positive"
					pageSlug={pageSlug}
					chunkSlug={chunkSlug}
					userId={userId}
				/>
				<QuestionFeedback
					type="negative"
					pageSlug={pageSlug}
					chunkSlug={chunkSlug}
					userId={userId}
				/>
			</CardHeader>

			<CardContent className="flex flex-col justify-center items-center space-y-4 w-4/5 mx-auto">
				{answerStatus === AnswerStatusStairs.BOTH_INCORRECT && (
					<div className="text-sm">
						<p className="text-red-400">
							<b>iTELL AI says:</b> You likely got a part of the answer wrong.
							Please try again.
						</p>
						<p className=" underline">
							{isLastQuestion
								? 'If you believe iTELL AI has made an error, you can click on the "Unlock summary" button to skip this question and start writing a summary.'
								: 'If you believe iTELL AI has made an error, you can click on the "Skip this question" button to skip this question.'}
						</p>
					</div>
				)}

				{answerStatus === AnswerStatusStairs.SEMI_CORRECT && (
					<p className="text-yellow-600 text-xs">
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
						{shouldBlur && (
							<p className="text-sm">
								Click on the button below to continue reading. Please use the
								thumbs-up or thumbs-down icons on the top right side of this box
								if you have any feedback about this question that you would like
								to provide before you continue reading.
							</p>
						)}
					</div>
				) : (
					question && (
						<p>
							<span className="font-bold">Question </span>
							{!shouldBlur && <span className="font-bold">(Optional)</span>}:{" "}
							{question}
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
										<span className="inline-flex items-center justify-center gap-2">
											<KeyRoundIcon className="size-4 mr-2" />
											Reveal Answer
										</span>
									</Button>
								</HoverCardTrigger>
								<HoverCardContent className="w-80">
									<p className="leading-relaxed no-select">{answer}</p>
								</HoverCardContent>
							</HoverCard>
						)}

						{answerStatus === AnswerStatusStairs.BOTH_CORRECT &&
						isNextButtonDisplayed ? (
							// when answer is all correct and next button should be displayed
							<FinishQuestionButton
								userId={userId}
								chunkSlug={chunkSlug}
								pageSlug={pageSlug}
								isLastQuestion={isLastQuestion}
								condition={Condition.STAIRS}
							/>
						) : (
							// when answer is not all correct
							<>
								{formState.answerStatus !== AnswerStatusStairs.BOTH_CORRECT && (
									<SubmitButton chunkSlug={chunkSlug} />
								)}

								{answerStatus !== AnswerStatusStairs.UNANSWERED &&
									isNextButtonDisplayed && (
										<FinishQuestionButton
											userId={userId}
											chunkSlug={chunkSlug}
											pageSlug={pageSlug}
											isLastQuestion={isLastQuestion}
											condition={Condition.STAIRS}
										/>
									)}
							</>
						)}
					</div>
					<div className="flex items-center justify-center mt-4">
						{(answerStatus === AnswerStatusStairs.SEMI_CORRECT ||
							answerStatus === AnswerStatusStairs.BOTH_INCORRECT) && (
							<ExplainButton
								userId={userId}
								chunkSlug={chunkSlug}
								pageSlug={pageSlug}
								input={input}
							/>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

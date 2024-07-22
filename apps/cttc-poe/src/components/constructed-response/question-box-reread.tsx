"use client";

import { isProduction } from "@/lib/constants";
import { createConstructedResponse } from "@/lib/constructed-response/actions";
import { Condition } from "@/lib/control/condition";
import { getQAScore } from "@/lib/question";
import { reportSentry } from "@/lib/utils";
import { LoginButton } from "@auth//auth-form";
import { cn } from "@itell/core/utils";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	TextArea,
} from "@itell/ui/client";
import { Card, CardContent, Warning } from "@itell/ui/server";
import { KeyRoundIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useConstructedResponse } from "../provider/page-provider";
import { FinishQuestionButton } from "./finish-question-button";
import { SubmitButton } from "./submit-button";
import { AnswerStatusReread, QuestionScore } from "./types";

type Props = {
	userId: string | null;
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
	userId,
	question,
	answer,
	chunkSlug,
	pageSlug,
}: Props) => {
	const { shouldBlur, finishChunk } = useConstructedResponse((state) => ({
		shouldBlur: state.shouldBlur,
		finishChunk: state.finishChunk,
	}));

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
		if (input.length === 0) {
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
			createConstructedResponse({
				userId,
				chunkSlug,
				pageSlug,
				score,
				text: input,
				condition: Condition.RANDOM_REREAD,
			});

			finishChunk(chunkSlug, false);

			return {
				answerStatus: AnswerStatusReread.ANSWERED,
				error: null,
			};
		} catch (err) {
			console.log("constructed response evaluation error", err);
			reportSentry("score constructed response", {
				pageSlug,
				chunkSlug,
				input,
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
	const isNextButtonDisplayed =
		shouldBlur && answerStatus === AnswerStatusReread.ANSWERED;

	useEffect(() => {
		if (formState.error) {
			toast.warning(formState.error);
		}
	}, [formState]);

	const isLastQuestion = chunkSlug === chunkSlug.at(-1);

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
		<>
			<Card
				className={cn(
					"flex justify-center items-center flex-col py-4 px-6 space-y-2 animate-in fade-in zoom-10",
					answerStatus === AnswerStatusReread.ANSWERED
						? "border-2 border-border"
						: "",
				)}
			>
				<CardContent className="flex flex-col justify-center items-center space-y-4 w-4/5 mx-auto">
					{question && (
						<p>
							<span className="font-bold">Question </span>
							{!shouldBlur && <span className="font-bold">(Optional)</span>}:{" "}
							{question}
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
										<p className="leading-relaxed no-select">{answer}</p>
									</HoverCardContent>
								</HoverCard>
							)}

							<SubmitButton
								answered={answerStatus === AnswerStatusReread.ANSWERED}
							/>

							{answerStatus !== AnswerStatusReread.UNANSWERED &&
								isNextButtonDisplayed && (
									<FinishQuestionButton
										userId={userId}
										pageSlug={pageSlug}
										chunkSlug={chunkSlug}
										isLastQuestion={isLastQuestion}
										condition={Condition.RANDOM_REREAD}
									/>
								)}
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
};

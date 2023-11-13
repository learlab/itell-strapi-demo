"use client";

import { cn } from "@itell/core/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@itell/ui/server";
import { AlertTriangle, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import Spinner from "../spinner";
import { getQAScore } from "@/lib/question";
import { useQA } from "../context/qa-context";
import { FeedbackModal } from "./feedback-modal";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	TextArea,
} from "../client-components";
import { toast } from "sonner";
// import shake effect
import "@/styles/shakescreen.css";
import { useSession } from "next-auth/react";
import { createQuestionAnswer } from "@/lib/server-actions";

type Props = {
	question: string;
	answer: string;
	chapter: number;
	section: number;
	subsection: number;
};

// state for answer correctness
enum AnswerStatus {
	UNANSWERED = 0,
	BOTH_CORRECT = 1,
	SEMI_CORRECT = 2,
	BOTH_INCORRECT = 3,
}

// state for border color
enum BorderColor {
	BLUE = "border-blue-400",
	RED = "border-red-400",
	GREEN = "border-green-400",
	YELLOW = "border-yellow-400",
}

export const QuestionBox = ({
	question,
	chapter,
	section,
	subsection,
	answer,
}: Props) => {
	const { data: session } = useSession();
	const { goToNextChunk } = useQA();
	const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
	const [isShaking, setIsShaking] = useState(false);
	const [answerStatus, setAnswerStatus] = useState(AnswerStatus.UNANSWERED);
	const [borderColor, setBorderColor] = useState(BorderColor.BLUE);
	// If QA passed
	const [isCelebrating, setIsCelebrating] = useState(false);
	// Handle spinner animation when loading
	const [isLoading, setIsLoading] = useState(false);
	// Check if feedback is positive or negative
	const [isPositiveFeedback, setIsPositiveFeedback] = useState(false);
	// QA input
	const [inputValue, setInputValue] = useState("");
	// Next chunk button display
	const [isDisplayNextButton, setIsDisplayNextButton] = useState(true);

	const thenGoToNextChunk = () => {
		goToNextChunk();
		setIsDisplayNextButton(false);
	};

	const positiveModal = () => {
		setIsFeedbackModalOpen(true);
		setIsPositiveFeedback(true);
	};

	// When negative review is clicked
	const negativeModal = () => {
		setIsFeedbackModalOpen(true);
		setIsPositiveFeedback(false);
	};

	const passed = () => {
		setAnswerStatus(AnswerStatus.BOTH_CORRECT);
		setBorderColor(BorderColor.GREEN);
		setIsCelebrating(true);

		// Stop the confettis after a short delay
		setTimeout(() => {
			setIsCelebrating(false);
		}, 750);
	};

	// Function to trigger the shake animation
	const shakeModal = () => {
		setIsShaking(true);

		// Reset the shake animation after a short delay
		setTimeout(() => {
			setIsShaking(false);
		}, 400);
	};

	// Semi-celebrate when response is 1
	const semiPassed = () => {
		setBorderColor(BorderColor.YELLOW);
		setAnswerStatus(AnswerStatus.SEMI_CORRECT);
	};

	// Failed = response is 0
	const failed = () => {
		shakeModal();
		setBorderColor(BorderColor.RED);
		setAnswerStatus(AnswerStatus.BOTH_INCORRECT);
	};

	const handleSubmit = async () => {
		// Spinner animation when loading
		setIsLoading(true);
		try {
			const response = await getQAScore({
				input: inputValue,
				chapter: String(chapter),
				section: String(section),
				subsection: String(subsection),
			});

			if (!response.success) {
				// API response is not in correct shape
				console.error("API Response error", response);
				return toast.error("Answer evaluation failed, please try again later");
			}

			const result = response.data;

			if (result.score === 2) {
				passed();
			} else if (result.score === 1) {
				semiPassed();
			} else {
				failed();
			}
			if (session?.user) {
				await createQuestionAnswer({
					userId: session.user.id,
					response: inputValue,
					chapter: chapter,
					section: section,
					subsection: subsection,
					score: result.score,
				});
			}
		} catch (err) {
			console.log("failed to score answer", err);
			return toast.error("Question evaluation failed, please try again later");
		} finally {
			setIsLoading(false);
		}
	};

	if (!session?.user) {
		return (
			<Card>
				<CardHeader>You need to be logged in to view this question.</CardHeader>
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
				{isCelebrating && <ConfettiExplosion width={window.innerWidth} />}

				<CardHeader className="flex flex-row justify-end items-baseline w-full p-2 gap-1">
					<ThumbsUp
						className="hover:stroke-emerald-400 hover:cursor-pointer w-4 h-4"
						onClick={positiveModal}
					/>
					<ThumbsDown
						className="hover:stroke-rose-700 hover:cursor-pointer w-4 h-4"
						onClick={negativeModal}
					/>
				</CardHeader>

				<CardDescription className="flex justify-center items-center text-sm font-light text-zinc-500">
					<p className="inline-flex question-box-text">
						{" "}
						<AlertTriangle className="stroke-yellow-400 mr-2" /> iTELL AI is in
						alpha testing. It will try its best to help you but it can still
						make mistakes. Let us know how you feel about iTELL AI's performance
						using the feedback icons on the top right side of this box (thumbs
						up or thumbs down).{" "}
					</p>
				</CardDescription>

				<CardContent className="flex flex-col justify-center items-center space-y-4">
					{answerStatus === AnswerStatus.BOTH_INCORRECT && (
						<div className="text-xs">
							<p className="text-red-400 question-box-text">
								<b>iTELL AI says:</b> You likely got a part of the answer wrong.
								Please try again.
							</p>
							<p className="question-box-text">
								<u>
									If you believe iTELL AI has made an error, you can click on
									the "Skip this question" button to skip this question.
								</u>{" "}
								If you would like to help improve iTELL, please click on the
								feedback icons on the top right side of this box to give us
								feedback on this question.
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
						<>
							<p className="text-xl2 text-emerald-600 text-center question-box-text">
								Your answer was CORRECT!
							</p>
							<p className="text-sm question-box-text">
								Click on the button below to continue reading. Please use the
								thumbs-up or thumbs-down icons on the top right side of this box
								if you have any feedback about this question that you would like
								to provide before you continue reading.
							</p>
						</>
					) : (
						question && (
							<p className="question-box-text">
								<b>Question:</b> {question}
							</p>
						)
					)}

					{answerStatus !== AnswerStatus.BOTH_CORRECT && (
						<TextArea
							rows={2}
							className="rounded-md shadow-md  p-4"
							value={inputValue}
							onValueChange={setInputValue}
							onPaste={(e) => {
								e.preventDefault();
								toast.warning("Copy & Paste is not allowed for question");
							}}
						/>
					)}

					<div className="flex flex-col sm:flex-row justify-center items-center gap-2">
						{answerStatus !== AnswerStatus.UNANSWERED && (
							<HoverCard>
								<HoverCardTrigger asChild>
									<Button variant="secondary">Reveal Answer</Button>
								</HoverCardTrigger>
								<HoverCardContent className="w-80">
									<p className="leading-relaxed">{answer}</p>
								</HoverCardContent>
							</HoverCard>
						)}
						{answerStatus === AnswerStatus.BOTH_CORRECT &&
						isDisplayNextButton ? (
							<Button
								variant={"secondary"}
								onClick={thenGoToNextChunk}
								type="button"
							>
								Click Here to Continue Reading
							</Button>
						) : (
							<>
								{answerStatus !== AnswerStatus.BOTH_CORRECT && (
									<Button
										variant={"secondary"}
										onClick={handleSubmit}
										disabled={isLoading}
									>
										{isLoading && <Spinner className="inline mr-2" />}
										{answerStatus === AnswerStatus.UNANSWERED
											? "Submit"
											: "Resubmit"}
									</Button>
								)}

								{answerStatus !== AnswerStatus.UNANSWERED &&
									isDisplayNextButton && (
										<Button variant={"ghost"} onClick={thenGoToNextChunk}>
											{answerStatus === AnswerStatus.SEMI_CORRECT
												? "Continue Reading"
												: "Skip this question"}
										</Button>
									)}
							</>
						)}
					</div>
				</CardContent>
			</Card>
			<FeedbackModal
				open={isFeedbackModalOpen}
				onOpenChange={setIsFeedbackModalOpen}
				isPositive={isPositiveFeedback}
			/>
		</>
	);
};

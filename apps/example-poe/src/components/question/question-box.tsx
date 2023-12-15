"use client";

import { cn } from "@itell/core/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	Warning,
} from "@itell/ui/server";
import { AlertTriangle, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { Spinner } from "../spinner";
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
import { createConstructedResponse, createEvent } from "@/lib/server-actions";
import { NextChunkButton } from "./next-chunk-button";
import { isProduction } from "@/lib/constants";

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
	const [answerInput, setAnswerInput] = useState("");
	// Next chunk button display
	const [isDisplayNextButton, setIsDisplayNextButton] = useState(true);

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
		if (answerInput.trim() === "") {
			toast.warning("Please enter an answer to move forward");
			return;
		} else {
			// Spinner animation when loading
			setIsLoading(true);
			try {
				const response = await getQAScore({
					input: answerInput,
					chapter: String(chapter),
					section: String(section),
					subsection: String(subsection),
				});

				if (!response.success) {
					// API response is not in correct shape
					console.error("API Response error", response);
					return toast.error(
						"Answer evaluation failed, please try again later",
					);
				}

				const result = response.data;

				if (result.score === 2) {
					passed();
				} else if (result.score === 1) {
					semiPassed();
				} else {
					failed();
				}
				if (session?.user && isProduction) {
					// when there is no session, question won't be displayed
					await createConstructedResponse({
						response: answerInput,
						chapter: chapter,
						section: section,
						subsection: subsection,
						score: result.score,
						user: {
							connect: {
								id: session.user.id,
							},
						},
					});
				}
			} catch (err) {
				console.log("failed to score answer", err);
				return toast.error(
					"Question evaluation failed, please try again later",
				);
			} finally {
				setIsLoading(false);
			}
		}
	};

	if (!session?.user) {
		return (
			<Warning>
				You need to be logged in to view this question and move forward.
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
				{isCelebrating && <ConfettiExplosion width={window.innerWidth} />}

				<CardHeader className="flex flex-row justify-end items-baseline w-full p-2 gap-1">
					<CardDescription className="flex justify-center items-center font-light text-zinc-500 w-10/12 mr-4 text-xs">
						{" "}
						<AlertTriangle className="stroke-yellow-400 mr-4" /> iTELL AI is in
						alpha testing. It will try its best to help you but it can still
						make mistakes. Let us know how you feel about iTELL AI's performance
						using the feedback icons to the right (thumbs up or thumbs down).{" "}
					</CardDescription>
					<ThumbsUp
						className="hover:stroke-emerald-400 hover:cursor-pointer w-4 h-4"
						onClick={positiveModal}
					/>
					<ThumbsDown
						className="hover:stroke-rose-700 hover:cursor-pointer w-4 h-4"
						onClick={negativeModal}
					/>
				</CardHeader>

				<CardContent className="flex flex-col justify-center items-center space-y-4  w-[600px] md:[850px] mx-auto">
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
						<div className="flex items-center flex-col">
							<p className="text-xl2 text-emerald-600 text-center">
								Your answer was CORRECT!
							</p>
							<p className="text-sm">
								Click on the button below to continue reading. Please use the
								thumbs-up or thumbs-down icons on the top right side of this box
								if you have any feedback about this question that you would like
								to provide before you continue reading.
							</p>
						</div>
					) : (
						question && (
							<p>
								<b>Question:</b> {question}
							</p>
						)
					)}
					{answerStatus !== AnswerStatus.BOTH_CORRECT && (
						<TextArea
							rows={2}
							className="rounded-md shadow-md  p-4"
							value={answerInput}
							onValueChange={setAnswerInput}
							onPaste={(e) => {
								if (isProduction) {
									e.preventDefault();
									toast.warning("Copy & Paste is not allowed for question");
								}
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
							<NextChunkButton
								clickEventType="post-question chunk reveal"
								onClick={() => setIsDisplayNextButton(false)}
							>
								Click Here to Continue Reading
							</NextChunkButton>
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
										<NextChunkButton
											clickEventType="post-question chunk reveal"
											variant="ghost"
											onClick={() => setIsDisplayNextButton(false)}
										>
											{answerStatus === AnswerStatus.SEMI_CORRECT
												? "Continue Reading"
												: "Skip this question"}
										</NextChunkButton>
									)}
							</>
						)}
					</div>
				</CardContent>
			</Card>
			<FeedbackModal
				pageSlug={`${chapter}-${section}-${subsection}`}
				open={isFeedbackModalOpen}
				onOpenChange={setIsFeedbackModalOpen}
				isPositive={isPositiveFeedback}
			/>
		</>
	);
};

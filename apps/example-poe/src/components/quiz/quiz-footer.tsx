"use client";

import { Button } from "../client-components";
import { useQuiz } from "../context/quiz-context";
import { Spinner } from "../spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageData, makePageHref } from "@/lib/utils";
import { QuizData } from "@/lib/quiz";
import { useState } from "react";

const BackButton = () => {
	const { currentStep, prevStep } = useQuiz();
	const canBack = currentStep > 0;

	return (
		<Button variant="secondary" onClick={prevStep} disabled={!canBack}>
			Back
		</Button>
	);
};

const ForwardButton = () => {
	const { nextStep, canNext } = useQuiz();

	return (
		<Button disabled={!canNext} onClick={nextStep}>
			Next
		</Button>
	);
};

const FinishButton = () => {
	const [pending, isPending] = useState(false);

	return (
		<Button disabled={pending} type="submit">
			{pending && <Spinner className="size-4 mr-2" />}
			Finish
		</Button>
	);
};

const finishQuiz = async (pageSlug: string) => {
	return await fetch("/api/quiz", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			page_slug: pageSlug,
		}),
	});
};

export const QuizFooter = ({
	data,
	pageData,
}: { pageData: PageData; data: QuizData }) => {
	const { currentStep, answerData } = useQuiz();
	const [correctCount, setCorrectCount] = useState<number | undefined>(
		undefined,
	);
	const router = useRouter();
	const isLast = currentStep === data.length - 1;

	const getCorrectCount = () => {
		let correctCount = 0;
		for (const questionId in answerData) {
			const question = data.find((q) => q.id === Number(questionId));
			if (question) {
				const userAnswers = answerData[questionId];
				const correctAnswers = question.Answers.filter((a) => a.IsCorrect).map(
					(a) => a.id,
				);

				if (
					userAnswers.length === correctAnswers.length &&
					userAnswers.every((answer) => correctAnswers.includes(answer))
				) {
					correctCount++;
				}
			}
		}

		return correctCount;
	};

	return (
		<footer className="mt-10 space-y-4">
			{correctCount && (
				<p>
					You made {correctCount} / {data.length} correct!
				</p>
			)}
			<div className="flex justify-between">
				<BackButton />
				{isLast ? (
					<form
						action={async () => {
							try {
								// finishPageQuiz(pageData.page_slug);
								const correctCount = getCorrectCount();
								setCorrectCount(correctCount);

								await finishQuiz(pageData.page_slug);

								if (pageData.nextPageSlug) {
									toast.success("Redirecting you to the next page ...");
									setTimeout(() => {
										router.push(makePageHref(pageData.nextPageSlug as string));
									}, 2000);
								} else {
									toast.success("You have finished the entire textbook!");
								}
							} catch (error) {
								toast.error(
									"Failed to submit your answers, please try again later",
								);
							}
						}}
					>
						<FinishButton />
					</form>
				) : (
					<ForwardButton />
				)}
			</div>
		</footer>
	);
};

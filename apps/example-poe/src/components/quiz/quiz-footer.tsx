"use client";

import { Button } from "../client-components";
import { useQuiz } from "../context/quiz-context";
import { Spinner } from "../spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageData, makePageHref } from "@/lib/utils";
import { QuizData } from "@/lib/quiz";
import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";

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
	const { pending } = useFormStatus();

	return (
		<Button disabled={pending} type="submit">
			{pending && <Spinner className="size-4 mr-2" />}
			Finish
		</Button>
	);
};

const ContinueReadingButton = ({ nextPageSlug }: { nextPageSlug: string }) => {
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	return (
		<Button
			disabled={pending}
			type="button"
			onClick={() => {
				startTransition(() => {
					router.push(makePageHref(nextPageSlug));
				});
			}}
		>
			{pending && <Spinner className="size-4 mr-2" />}
			Continue reading
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
	const [saved, setSaved] = useState(false);
	const { currentStep, answerData } = useQuiz();
	const [correctCount, setCorrectCount] = useState<number | undefined>(
		undefined,
	);
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
					You got {correctCount} / {data.length} correct!
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
								setSaved(true);

								if (pageData.nextPageSlug) {
									toast.success(
										"Quiz finished. You can now go to the next page",
									);
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
						{saved ? (
							pageData.nextPageSlug ? (
								<ContinueReadingButton nextPageSlug={pageData.nextPageSlug} />
							) : null
						) : (
							<FinishButton />
						)}
					</form>
				) : (
					<ForwardButton />
				)}
			</div>
		</footer>
	);
};

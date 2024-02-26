"use client";

import { QuizData, getQuizCorrectCount } from "@/lib/quiz";
import { createQuizAnswer } from "@/lib/server-actions";
import { PageData, makePageHref } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "../client-components";
import { useQuiz } from "../context/quiz-context";
import { Spinner } from "../spinner";

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

const FinishButton = ({
	disabled,
	...rest
}: React.ComponentPropsWithoutRef<"button">) => {
	const { pending } = useFormStatus();

	return (
		<Button disabled={disabled || pending} type="submit" {...rest}>
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

export const QuizFooter = ({
	data,
	pageData,
}: { pageData: PageData; data: QuizData }) => {
	const [saved, setSaved] = useState(false);
	const { currentStep, answerData, canNext } = useQuiz();
	const [correctCount, setCorrectCount] = useState<number | undefined>(
		undefined,
	);
	const isLast = currentStep === data.length - 1;

	return (
		<footer className="mt-10 space-y-4">
			{correctCount !== undefined && (
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
								const correctCount = getQuizCorrectCount(data, answerData);
								setCorrectCount(correctCount);

								await createQuizAnswer({
									pageSlug: pageData.page_slug,
									data: {
										choices: answerData,
										correctCount,
									},
								});
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
							<FinishButton disabled={!canNext} />
						)}
					</form>
				) : (
					<ForwardButton />
				)}
			</div>
		</footer>
	);
};

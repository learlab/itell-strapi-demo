"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../client-components";
import { useQuiz } from "../context/quiz-context";
import { Spinner } from "../spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createQuizAnswer } from "@/lib/server-actions";
import { getPageData, makePageHref } from "@/lib/utils";

const BackButton = () => {
	const { currentStep, prevStep } = useQuiz();
	const canBack = currentStep > 0;

	return (
		<Button variant="secondary" onClick={prevStep} disabled={!canBack}>
			Back
			<span>{currentStep}</span>
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

export const QuizFooter = ({
	pageSlug,
	stepNum,
}: { pageSlug: string; stepNum: number }) => {
	const { currentStep, answerData } = useQuiz();
	const router = useRouter();
	const isLast = currentStep === stepNum - 1;
	const pageData = getPageData(pageSlug);

	if (!pageData) {
		return <p>quiz not found</p>;
	}

	return (
		<footer className="mt-10 flex justify-between">
			<BackButton />
			{isLast ? (
				<form
					action={async () => {
						try {
							await createQuizAnswer({ pageSlug, data: answerData });
							if (pageData.nextPageSlug) {
								toast.success("Quiz completed. Redirecting ...");
								router.push(makePageHref(pageData.nextPageSlug));
							} else {
								toast.success("You have completed the entire textbook");
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
		</footer>
	);
};

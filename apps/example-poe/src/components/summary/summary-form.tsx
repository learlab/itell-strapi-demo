"use client";

import { makeInputKey, makePageHref } from "@/lib/utils";
import { ErrorFeedback } from "@itell/core/summary";
import { Warning } from "@itell/ui/server";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import Confetti from "react-dom-confetti";
import { useQA } from "../context/qa-context";
import { FormState } from "./page-summary";
import { SummaryFeedback } from "./summary-feedback";
import { SummaryInput } from "./summary-input";
import { SummaryProceedModal } from "./summary-proceed-modal";
import { SummarySubmitButton } from "./summary-submit-button";

type Props = {
	value?: string;
	pageSlug: string;
	inputEnabled?: boolean; // needed to force enabled input for summary edit page
	textareaClassName?: string;
	isFeedbackEnabled: boolean;
	initialState: FormState;
	onSubmit: (prevState: FormState, formData: FormData) => Promise<FormState>;
};

export const SummaryForm = ({
	value,
	inputEnabled,
	pageSlug,
	isFeedbackEnabled,
	initialState,
	onSubmit,
	textareaClassName,
}: Props) => {
	const [formState, formAction] = useFormState(onSubmit, initialState);
	const router = useRouter();
	const { isPageFinished, pageStatus } = useQA();
	const editDisabled = inputEnabled
		? false
		: pageStatus.isPageUnlocked
		  ? false
		  : !isPageFinished;

	useEffect(() => {
		if (formState.showQuiz) {
			router.push(`${makePageHref(pageSlug)}/quiz`);
		}
	}, [formState]);

	return (
		<section>
			{formState.feedback && (
				<SummaryFeedback
					pageSlug={pageSlug}
					feedback={formState.feedback}
					canProceed={formState.canProceed}
				/>
			)}
			<Confetti
				active={formState.feedback?.isPassed ? isFeedbackEnabled : false}
			/>
			<form
				className="mt-2 space-y-4"
				action={(payload) => {
					localStorage.setItem(
						makeInputKey(pageSlug),
						payload.get("input") as string,
					);
					formAction(payload);
				}}
			>
				<SummaryInput
					value={value}
					disabled={editDisabled}
					pageSlug={pageSlug}
					textAreaClassName={textareaClassName}
				/>
				{formState.error && <Warning>{ErrorFeedback[formState.error]}</Warning>}
				<div className="flex justify-end">
					{/* isPageUnfinished is undefine when used in summary [id] page */}
					<SummarySubmitButton
						disabled={isPageFinished === undefined ? false : !isPageFinished}
					/>
				</div>
			</form>
			{formState.canProceed && !formState.showQuiz && (
				<SummaryProceedModal
					pageSlug={pageSlug}
					isPassed={formState.feedback?.isPassed || false}
					title={
						isFeedbackEnabled
							? formState.feedback?.isPassed
								? "Good job summarizing the text 🎉"
								: "You can now move on 👏"
							: "Your summary is accepted"
					}
				>
					<div className="space-y-2">
						{!formState.feedback?.isPassed && (
							<p>You have written multiple summaries for this page.</p>
						)}
						<p>
							You can now move on to the next page by clicking the page link
							above the summary box or the left sidebar.
						</p>
					</div>
				</SummaryProceedModal>
			)}
		</section>
	);
};

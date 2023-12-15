"use client";

import { Warning } from "@itell/ui/server";
import { SummaryFeedback } from "./summary-feedback";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { ErrorFeedback, SummaryFormState } from "@itell/core/summary";
import { SummaryInput } from "./summary-input";
import { useFormState } from "react-dom";
import { SummarySubmitButton } from "./summary-submit-button";
import { SummaryProceedModal } from "./summary-proceed-modal";
import pluralize from "pluralize";
import { makeInputKey } from "@/lib/utils";
import { Confetti } from "../ui/confetti";

type Props = {
	isFeedbackEnabled: boolean;
	chapter: number;
	textareaClassName?: string;
	onSubmit: (
		prevState: SummaryFormState,
		formData: FormData,
	) => Promise<SummaryFormState>;
};

const initialState: SummaryFormState = {
	response: null,
	feedback: null,
	canProceed: false,
	error: null,
};

export const SummaryForm = ({
	isFeedbackEnabled,
	chapter,
	onSubmit,
	textareaClassName,
}: Props) => {
	const [formState, formAction] = useFormState(onSubmit, initialState);

	return (
		<>
			{formState.feedback && <SummaryFeedback feedback={formState.feedback} />}
			<Confetti active={formState.feedback?.isPassed || false} />
			<form
				className="mt-2 space-y-4"
				action={(payload) => {
					localStorage.setItem(
						makeInputKey(chapter),
						payload.get("input") as string,
					);
					formAction(payload);
				}}
			>
				<SummaryInput chapter={chapter} textAreaClassName={textareaClassName} />
				{formState.error && <Warning>{ErrorFeedback[formState.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton />
				</div>
			</form>
			{formState.canProceed && (
				<SummaryProceedModal
					chapter={chapter}
					isPassed={formState.feedback?.isPassed || false}
					title={
						isFeedbackEnabled
							? formState.feedback?.isPassed
								? "Good job summarizing the text"
								: "You can now move on"
							: "Your summary is accepted"
					}
				>
					<div>
						{formState.feedback?.isPassed ? (
							<p>You can now move on to the next page</p>
						) : (
							<p>
								You have written more than{" "}
								{pluralize("summary", PAGE_SUMMARY_THRESHOLD, true)} for this
								page, you can now move on to the next page
							</p>
						)}
					</div>
				</SummaryProceedModal>
			)}
		</>
	);
};

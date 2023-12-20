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
import Confetti from "react-dom-confetti";

type Props = {
	userPageSlug: string | null;
	pageSlug: string;
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
	userPageSlug,
	pageSlug,
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
						makeInputKey(pageSlug),
						payload.get("input") as string,
					);
					formAction(payload);
				}}
			>
				<SummaryInput
					userPageSlug={userPageSlug}
					pageSlug={pageSlug}
					textAreaClassName={textareaClassName}
				/>
				{formState.error && <Warning>{ErrorFeedback[formState.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton />
				</div>
			</form>
			{formState.canProceed && (
				<SummaryProceedModal
					pageSlug={pageSlug}
					isPassed={formState.feedback?.isPassed || false}
					title={
						formState.feedback?.isPassed
							? "Good job summarizing the text 🎉"
							: "You can now move on 👏"
					}
				>
					<div className="space-y-2">
						{formState.feedback?.isPassed ? (
							<p>You can now move on to the next page</p>
						) : (
							<p>
								You have written more than{" "}
								{pluralize("summary", PAGE_SUMMARY_THRESHOLD, true)} for this
								page.
							</p>
						)}
						<p>
							you can now move on to the next page by clicking the page link
							above the summary box or the left sidebar.
						</p>
					</div>
				</SummaryProceedModal>
			)}
		</>
	);
};

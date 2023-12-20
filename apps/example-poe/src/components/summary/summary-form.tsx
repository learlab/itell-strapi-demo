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
import { isPageAfter } from "@/lib/location";
import { useQA } from "../context/qa-context";
import { useEffect, useState } from "react";
import { useCurrentChunk } from "@/lib/hooks/utils";

type Props = {
	value?: string;
	pageSlug: string;
	pageVisible?: boolean;
	inputEnabled?: boolean; // needed to force enabled input for summary edit page
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
	value,
	inputEnabled,
	pageVisible,
	pageSlug,
	onSubmit,
	textareaClassName,
}: Props) => {
	const [formState, formAction] = useFormState(onSubmit, initialState);
	const [inputDisabled, setInputDisabled] = useState(true);
	const { chunks, currentChunk } = useQA();

	useEffect(() => {
		if (chunks) {
			// input is disabled when
			// 1. the page is not visible
			// 2. or not all chunks have been revealed
			if (!pageVisible) {
				setInputDisabled(true);
			} else {
				setInputDisabled(currentChunk < chunks.length - 1);
			}
		}
	}, [chunks, currentChunk]);

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
					value={value}
					disabled={inputEnabled ? false : inputDisabled}
					pageSlug={pageSlug}
					textAreaClassName={textareaClassName}
				/>
				{formState.error && <Warning>{ErrorFeedback[formState.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton disabled={inputDisabled} />
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
						{formState.feedback?.isPassed && (
							<p>You have written multiple summaries for this page.</p>
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

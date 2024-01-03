"use client";

import { Warning } from "@itell/ui/server";
import { SummaryFeedback } from "./summary-feedback";
import { ErrorFeedback } from "@itell/core/summary";
import { SummaryInput } from "./summary-input";
import { useFormState } from "react-dom";
import { SummarySubmitButton } from "./summary-submit-button";
import { SummaryProceedModal } from "./summary-proceed-modal";
import { makeInputKey, makePageHref } from "@/lib/utils";
import Confetti from "react-dom-confetti";
import { useQA } from "../context/qa-context";
import { useEffect, useState } from "react";
import { FormState } from "./page-summary";
import { useRouter } from "next/navigation";

type Props = {
	value?: string;
	pageSlug: string;
	pageVisible?: boolean;
	inputEnabled?: boolean; // needed to force enabled input for summary edit page
	textareaClassName?: string;
	initialState: FormState;
	onSubmit: (prevState: FormState, formData: FormData) => Promise<FormState>;
};

export const SummaryForm = ({
	value,
	inputEnabled,
	pageVisible,
	pageSlug,
	initialState,
	onSubmit,
	textareaClassName,
}: Props) => {
	const [formState, formAction] = useFormState(onSubmit, initialState);
	const [inputDisabled, setInputDisabled] = useState(true);
	const { chunks, currentChunk } = useQA();
	const router = useRouter();

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
		} else {
			setInputDisabled(false);
		}
	}, [chunks, currentChunk]);

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
			{formState.canProceed && !formState.showQuiz && (
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
		</section>
	);
};

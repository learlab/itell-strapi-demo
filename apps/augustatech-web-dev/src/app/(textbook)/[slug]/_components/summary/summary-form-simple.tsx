"use client";
import { incrementUserPageSlugAction } from "@/actions/user";
import { DelayMessage } from "@/components/delay-message";
import { useQuestionStore } from "@/components/provider/page-provider";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { SelectSummaryReady } from "@/lib/store/question-store";
import { PageData, reportSentry } from "@/lib/utils";
import { useDebounce } from "@itell/core/hooks";
import { ErrorFeedback, ErrorType } from "@itell/core/summary";
import { StatusButton } from "@itell/ui/client";
import { Warning } from "@itell/ui/server";
import { useSelector } from "@xstate/store/react";
import { ArrowRightIcon, CheckSquare2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

type Props = {
	pageStatus: PageStatus;
	page: PageData;
};

export const SummaryFormSimple = React.memo(({ pageStatus, page }: Props) => {
	const questionStore = useQuestionStore();
	const isSummaryReady = useSelector(questionStore, SelectSummaryReady);

	const router = useRouter();
	const [finished, setFinished] = useState(pageStatus.unlocked);

	const {
		action,
		isError,
		isPending: _isPending,
		error,
		isDelayed,
	} = useActionStatus(
		async (e: FormEvent) => {
			e.preventDefault();
			if (finished && page.nextPageSlug) {
				router.push(page.nextPageSlug);
				return;
			}
			const [data, err] = await incrementUserPageSlugAction({
				currentPageSlug: page.page_slug,
			});
			if (err) {
				throw new Error(err.message);
			}
			if (isLastPage(page.page_slug)) {
				toast.info("You have finished the entire textbook!", {
					important: true,
					duration: 100000,
				});
			}

			setFinished(true);
		},
		{ delayTimeout: 3000 },
	);
	const isPending = useDebounce(_isPending, 100);

	useEffect(() => {
		if (isError) {
			reportSentry("summary simple", {
				pageSlug: page.page_slug,
				error,
			});
		}
	}, [isError]);

	if (!isSummaryReady) {
		return (
			<div className="max-w-2xl mx-auto">
				<p>Finish the entire page to move on.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<p className="font-light text-lg mb-4" role="status">
				{finished
					? "You have completed this page, but you are still welcome to read the reference summary below to enhance understanding."
					: "Below is a reference summary for this page. Please read it carefully to better understand the information presented."}
			</p>
			{page.referenceSummary && <p>{page.referenceSummary}</p>}

			<h2 id="completion-form-heading" className="sr-only">
				completion
			</h2>
			<form
				aria-labelledby="completion-form-heading"
				className="flex justify-end gap-2"
				onSubmit={action}
			>
				<StatusButton
					pending={isPending}
					disabled={finished && !page.nextPageSlug}
					className="w-44"
				>
					{!finished ? (
						<span className="inline-flex gap-1 items-center">
							<CheckSquare2Icon className="size-4" /> Mark as completed
						</span>
					) : page.nextPageSlug ? (
						<span className="inline-flex gap-1 items-center">
							<ArrowRightIcon className="size-4" /> Go to next page
						</span>
					) : (
						<span>Textbook finished</span>
					)}
				</StatusButton>
			</form>
			{isError && (
				<Warning role="alert">{ErrorFeedback[ErrorType.INTERNAL]}</Warning>
			)}
			{isDelayed && <DelayMessage />}
		</div>
	);
});

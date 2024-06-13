"use client";

import { useSessionAction } from "@/lib/auth/context";
import { isProduction } from "@/lib/constants";
import { Condition } from "@/lib/control/condition";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { createSummary } from "@/lib/summary/actions";
import { incrementUserPage } from "@/lib/user/actions";
import {
	PageData,
	getChunkElement,
	reportSentry,
	scrollToElement,
} from "@/lib/utils";
import { usePortal } from "@itell/core/hooks";
import {
	ErrorFeedback,
	ErrorType,
	SummaryResponse,
	SummaryResponseSchema,
} from "@itell/core/summary";
import { Warning, buttonVariants } from "@itell/ui/server";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { User } from "lucia";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import { Button, StatusButton } from "../client-components";
import { NextPageButton } from "../page/next-page-button";
import { useConstructedResponse } from "../provider/page-provider";
import { SummaryInput, saveSummaryLocal } from "./summary-input";

type Props = {
	user: User;
	page: PageData;
	pageStatus: PageStatus;
};

const driverObj = driver();

export const SummaryFormReread = ({ user, page, pageStatus }: Props) => {
	const pageSlug = page.page_slug;
	const [finished, setFinished] = useState(pageStatus.unlocked);
	const [isTextbookFinished, setIsTextbookFinished] = useState(user.finished);
	const { chunks } = useConstructedResponse((state) => ({
		chunks: state.chunks,
	}));
	// skip first chunk, which is typically learning objectives
	const validChunks = chunks.slice(1);
	const randomChunkSlug =
		validChunks[Math.floor(Math.random() * validChunks.length)];

	const exitChunk = () => {
		const summaryEl = document.querySelector("#page-summary");

		driverObj.destroy();

		if (summaryEl) {
			scrollToElement(summaryEl as HTMLDivElement);
		}
	};

	const { nodes: portalNodes, addNode } = usePortal();
	const { addStage, clearStages, finishStage, stages } = useSummaryStage();
	const { updateUser } = useSessionAction();
	const requestBodyRef = useRef<string>("");
	const summaryResponseRef = useRef<SummaryResponse | null>(null);

	const goToRandomChunk = () => {
		// in production, only highlight 25% of the time
		// if (isProduction) {
		// 	if (Math.random() > 0.25) {
		// 		return;
		// 	}
		// }
		const el = getChunkElement(randomChunkSlug);
		if (el) {
			scrollToElement(el);
			driverObj.highlight({
				element: el,
				popover: {
					description:
						'Please re-read the highlighted chunk. when you are finished, press the "I finished rereading" button.',
					side: "right",
					align: "start",
				},
			});
		}
	};

	useEffect(() => {
		driverObj.setConfig({
			animate: false,
			smoothScroll: false,
			onPopoverRender: (popover) => {
				addNode(
					<Button onClick={exitChunk} size="sm" className="mt-4">
						I finished rereading
					</Button>,
					popover.wrapper,
				);
			},
			onDestroyStarted: () => {
				return toast.warning("Please finish rereading before moving on");
			},
		});
	}, []);

	const { status, isError, isDelayed, isPending, action, error } =
		useActionStatus(
			async (e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();

				clearStages();
				addStage("Saving");

				const formData = new FormData(e.currentTarget);
				const input = String(formData.get("input")).replaceAll("\u0000", "");

				saveSummaryLocal(pageSlug, input);
				requestBodyRef.current = JSON.stringify({
					summary: input,
					page_slug: pageSlug,
				});
				console.log("requestBody", requestBodyRef.current);
				const response = await fetch("/api/itell/score/summary", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: requestBodyRef.current,
				});
				const json = await response.json();
				const parsed = SummaryResponseSchema.safeParse(json);
				if (!parsed.success) {
					throw parsed.error;
				}
				const scores = parsed.data;
				summaryResponseRef.current = scores;

				await createSummary({
					text: input,
					userId: user.id,
					pageSlug,
					condition: Condition.RANDOM_REREAD,
					isPassed: scores.is_passed || false,
					containmentScore: scores.containment,
					similarityScore: scores.similarity,
					languageScore: scores.language,
					contentScore: scores.content,
				});
				const nextSlug = await incrementUserPage(user.id, pageSlug);
				finishStage("Saving");
				setFinished(true);

				if (isLastPage(pageSlug)) {
					updateUser({ finished: true });
					setIsTextbookFinished(true);
					toast.info("You have finished the entire textbook!");

					return;
				}

				updateUser({ pageSlug: nextSlug });
				if (!pageStatus.unlocked && Math.random() <= 0.25) {
					goToRandomChunk();
				}
			},
			{ delayTimeout: 10000 },
		);

	const isSummaryReady = useConstructedResponse(
		(state) => state.isSummaryReady,
	);

	useEffect(() => {
		if (isError) {
			finishStage("Analyzing");
			clearStages();

			console.log("score summary reread", error);
			reportSentry("score summary reread", {
				body: requestBodyRef.current,
				response: summaryResponseRef.current,
				error,
			});
		}
	}, [isError]);

	return (
		<section className="space-y-2">
			{portalNodes}
			{finished && page.nextPageSlug && (
				<div className="space-y-2 space-x-2">
					<p>
						You have finished this page. You can choose to refine your summary
						or move on to the next page.
					</p>
					<NextPageButton pageSlug={page.nextPageSlug} />
				</div>
			)}

			{isTextbookFinished && (
				<div className="space-y-2">
					<p>You have finished the entire textbook. Congratulations! 🎉</p>
				</div>
			)}

			<form className="space-y-4" onSubmit={action}>
				<SummaryInput
					disabled={isPending || !isSummaryReady}
					pageSlug={pageSlug}
					pending={isPending}
					stages={stages}
					userRole={user.role}
				/>
				{isError && <Warning>{ErrorFeedback[ErrorType.INTERNAL]}</Warning>}
				{isDelayed && (
					<p className="text-sm">
						The request is taking longer than usual, if this keeps loading
						without a response, please try refreshing the page. If the problem
						persists, please report to lear.lab.vu@gmail.com.
					</p>
				)}
				<div className="flex justify-end">
					<StatusButton disabled={!isSummaryReady} pending={isPending}>
						{status === "idle" ? "Submit" : "Resubmit"}
					</StatusButton>
				</div>
			</form>
		</section>
	);
};

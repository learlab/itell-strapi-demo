"use client";

import { createEventAction } from "@/actions/event";
import { createSummaryAction } from "@/actions/summary";
import { DelayMessage } from "@/components/delay-message";
import { useQuestion } from "@/components/provider/page-provider";
import { useSessionAction } from "@/components/provider/session-provider";
import { Spinner } from "@/components/spinner";
import { Condition, EventType } from "@/lib/constants";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import {
	PageData,
	getChunkElement,
	reportSentry,
	scrollToElement,
} from "@/lib/utils";
import {
	useDebounce,
	useKeystroke,
	usePortal,
	useTimer,
} from "@itell/core/hooks";
import {
	ErrorFeedback,
	ErrorType,
	SummaryResponse,
	SummaryResponseSchema,
} from "@itell/core/summary";
import { Button, StatusButton } from "@itell/ui/client";
import { Warning } from "@itell/ui/server";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { User } from "lucia";
import { SendHorizontalIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import {
	SummaryInput,
	getSummaryLocal,
	saveSummaryLocal,
} from "./summary-input";
import { NextPageButton } from "./summary-next-page-button";

type Props = {
	user: User;
	page: PageData;
	pageStatus: PageStatus;
};

const driverObj = driver();

export const SummaryFormReread = ({ user, page, pageStatus }: Props) => {
	const pageSlug = page.page_slug;
	const prevInput = useRef<string | undefined>();
	const { ref, data: keystrokes, clear: clearKeystroke } = useKeystroke();
	const [finished, setFinished] = useState(pageStatus.unlocked);
	const { chunks } = useQuestion((state) => ({
		chunks: state.chunkSlugs,
	}));

	const randomChunkSlug = useMemo(() => {
		// skip first chunk, which is typically learning objectives
		const validChunks = chunks.slice(1);
		return validChunks[Math.floor(Math.random() * validChunks.length)];
	}, []);

	const exitChunk = () => {
		const summaryEl = document.querySelector("#page-assignments");
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
	const isSummaryReady = useQuestion((state) => state.isSummaryReady);

	const goToRandomChunk = () => {
		const el = getChunkElement(randomChunkSlug);
		if (el) {
			scrollToElement(el);
			driverObj.highlight({
				element: el,
				popover: {
					description:
						'Please re-read the highlighted section. when you are finished, press the "I finished rereading" button.',
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
					<FinishReadingButton
						onClick={(time) => {
							exitChunk();

							if (!pageStatus.unlocked) {
								createEventAction({
									type: EventType.RANDOM_REREAD,
									pageSlug,
									data: { chunkSlug: randomChunkSlug, time },
								});
							}
						}}
					/>,
					popover.wrapper,
				);
			},
			onDestroyStarted: () => {
				return toast.warning("Please finish rereading before moving on");
			},
		});
	}, []);

	const {
		status,
		isError,
		isDelayed,
		isPending: _isPending,
		action,
		error,
	} = useActionStatus(
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

			const [data, err] = await createSummaryAction({
				summary: {
					text: input,
					pageSlug,
					condition: Condition.RANDOM_REREAD,
					isPassed: scores.is_passed || false,
					containmentScore: scores.containment,
					similarityScore: scores.similarity,
					languageScore: scores.language,
					contentScore: scores.content,
				},
				keystroke: {
					start: prevInput.current || getSummaryLocal(pageSlug) || "",
					data: keystrokes,
				},
			});
			if (err) {
				throw new Error(err.message);
			}

			clearKeystroke();
			finishStage("Saving");
			setFinished(true);
			prevInput.current = input;

			if (isLastPage(pageSlug)) {
				updateUser({ finished: true });
				toast.info("You have finished the entire textbook!");
				return;
			}

			updateUser({ pageSlug: data.nextPageSlug });

			// 25% random rereading if the page is not unlocked
			if (!pageStatus.unlocked && Math.random() <= 0.25) {
				goToRandomChunk();
			}
		},
		{ delayTimeout: 10000 },
	);
	const isPending = useDebounce(_isPending, 100);

	useEffect(() => {
		if (isError) {
			finishStage("Analyzing");
			clearStages();

			reportSentry("score summary reread", {
				body: requestBodyRef.current,
				response: summaryResponseRef.current,
				error,
			});
		}
	}, [isError]);

	return (
		<div className="flex flex-col gap-2">
			{portalNodes}

			<div role="status">
				{finished && page.nextPageSlug && (
					<div className="space-y-2 space-x-2">
						<p>
							You have finished this page and can move on. You are still welcome
							to improve the summary.
						</p>
						<NextPageButton pageSlug={page.nextPageSlug} />
					</div>
				)}
			</div>

			<h2 id="summary-form-heading" className="sr-only">
				submit summary
			</h2>
			<form
				className="space-y-4"
				onSubmit={action}
				aria-labelledby="summary-form-heading"
				aria-disabled={!isSummaryReady || isPending}
			>
				<SummaryInput
					disabled={!isSummaryReady}
					pageSlug={pageSlug}
					pending={isPending}
					stages={stages}
					userRole={user.role}
					ref={ref}
				/>
				{isError && <Warning>{ErrorFeedback[ErrorType.INTERNAL]}</Warning>}
				{isDelayed && <DelayMessage />}
				<div className="flex justify-end">
					<StatusButton
						disabled={!isSummaryReady}
						pending={isPending}
						className="w-32"
					>
						<span className="flex items-center gap-2">
							{isPending ? (
								<Spinner />
							) : (
								<SendHorizontalIcon className="size-4" />
							)}
							Submit
						</span>
					</StatusButton>
				</div>
			</form>
		</div>
	);
};

const FinishReadingButton = ({
	onClick,
}: { onClick: (time: number) => void }) => {
	const { time, clearTimer } = useTimer();

	return (
		<Button
			onClick={() => {
				onClick(time);
				clearTimer();
			}}
			size="sm"
			className="mt-4"
		>
			I finished rereading
		</Button>
	);
};

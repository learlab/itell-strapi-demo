"use client";

import { env } from "@/env.mjs";
import { SessionUser } from "@/lib/auth";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { PageStatus } from "@/lib/page-status";
import { createSummary } from "@/lib/summary/actions";
import { incrementUserPage } from "@/lib/user/actions";
import { PageData, getChunkElement, scrollToElement } from "@/lib/utils";
import { usePortal } from "@itell/core/hooks";
import {
	ErrorFeedback,
	ErrorType,
	SummaryResponse,
	SummaryResponseSchema,
	validateSummary,
} from "@itell/core/summary";
import { Warning, buttonVariants } from "@itell/ui/server";
import * as Sentry from "@sentry/nextjs";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";
import { toast } from "sonner";
import { useImmerReducer } from "use-immer";
import { Button } from "../client-components";
import { PageLink } from "../page/page-link";
import { useConfig, useConstructedResponse } from "../provider/page-provider";
import { SummaryInput, saveSummaryLocal } from "./summary-input";
import { SummarySubmitButton } from "./summary-submit-button";

type Props = {
	user: NonNullable<SessionUser>;
	page: PageData;
	pageStatus: PageStatus;
};

type StairsQuestion = {
	text: string;
	chunk: string;
	question_type: string;
};

type State = {
	prevInput: string;
	pending: boolean;
	error: ErrorType | null;
	finished: boolean;
};

type Action =
	| { type: "submit" }
	| { type: "fail"; payload: ErrorType }
	| { type: "finish"; payload: boolean }
	| { type: "set_prev_input"; payload: string };

const initialState: State = {
	prevInput: "",
	pending: false,
	error: null,
	finished: false,
};

const driverObj = driver();

const exitChunk = () => {
	const summaryEl = document.querySelector("#page-summary");

	driverObj.destroy();

	if (summaryEl) {
		scrollToElement(summaryEl as HTMLDivElement);
	}
};

export const SummaryFormReread = ({ user, page, pageStatus }: Props) => {
	const pageSlug = page.page_slug;
	const { chunks } = useConstructedResponse((state) => ({
		chunks: state.chunks,
	}));

	const feedbackType = useConfig((selector) => selector.feedbackType);
	const [state, dispatch] = useImmerReducer<State, Action>((draft, action) => {
		switch (action.type) {
			case "set_prev_input":
				draft.prevInput = action.payload;
				break;
			case "submit":
				draft.pending = true;
				draft.error = null;
				break;
			case "fail":
				draft.pending = false;
				draft.error = action.payload;
				break;
			case "finish":
				draft.pending = false;
				draft.finished = action.payload;
				break;
		}
	}, initialState);
	const { nodes: portalNodes, addNode } = usePortal();
	const { addStage, clearStages, finishStage, stages } = useSummaryStage();

	const goToRandomChunk = () => {
		const chunkSlug = chunks[Math.floor(Math.random() * chunks.length)];
		const el = getChunkElement(chunkSlug);
		if (el) {
			scrollToElement(el);
			setTimeout(() => {
				driverObj.highlight({
					element: el,
					popover: {
						description:
							'Please re-read the highlighted chunk. when you are finished, press the "I finished rereading" button.',
						side: "left",
						align: "start",
					},
				});
			}, 1000);
		} else {
			toast.warning(
				"No question found, please revise your summary or move on to the next page",
			);
		}
	};

	useEffect(() => {
		driverObj.setConfig({
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
	}, [feedbackType]);

	useEffect(() => {
		if (state.finished && !state.error) {
			goToRandomChunk();
		}
	}, [state]);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		clearStages();

		dispatch({ type: "submit" });
		addStage("Analyzing");

		const formData = new FormData(e.currentTarget);
		const input = String(formData.get("input")).replaceAll("\u0000", "");

		saveSummaryLocal(pageSlug, input);

		const error = validateSummary(
			input,
			state.prevInput === "" ? undefined : state.prevInput,
		);
		dispatch({ type: "set_prev_input", payload: input });
		if (error) {
			dispatch({ type: "fail", payload: error });
			return;
		}

		let requestBody = "";
		let summaryResponse: SummaryResponse | null = null;

		try {
			requestBody = JSON.stringify({
				summary: input,
				page_slug: pageSlug,
			});
			console.log("requestBody", requestBody);
			const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/score/summary`, {
				method: "POST",
				body: requestBody,
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await response.json();
			const parsed = SummaryResponseSchema.safeParse(json);
			if (!parsed.success) {
				throw parsed.error;
			}
			summaryResponse = parsed.data;
			summaryResponse.is_passed;
			await createSummary({
				text: input,
				pageSlug,
				response: summaryResponse,
			});
			await incrementUserPage(user.id, pageSlug);
			finishStage("Analyzing");
			dispatch({
				type: "finish",
				payload: true,
			});
		} catch (err) {
			finishStage("Analyzing");
			clearStages();
			dispatch({ type: "fail", payload: ErrorType.INTERNAL });

			console.log("summary error", err);
			Sentry.captureMessage("summary error", {
				extra: {
					body: requestBody,
					response: summaryResponse,
					msg: JSON.stringify(err),
				},
			});
		}
	};

	const isPageFinished = useConstructedResponse(
		(state) => state.isPageFinished,
	);
	const editDisabled = pageStatus.isPageUnlocked ? false : !isPageFinished;

	return (
		<section className="space-y-2">
			{portalNodes}
			<div className="flex gap-2 items-center flex-col">
				{state.finished && page.nextPageSlug && (
					<>
						<p>
							You have finished this page. You can choose to refine your summary
							or move on to the next page.
						</p>
						<PageLink
							pageSlug={page.nextPageSlug}
							className={buttonVariants({ variant: "outline" })}
						>
							Go to next page
						</PageLink>
					</>
				)}
			</div>

			<form className="mt-2 space-y-4" onSubmit={onSubmit}>
				<SummaryInput
					disabled={editDisabled || state.pending}
					pageSlug={pageSlug}
					pending={state.pending}
					stages={stages}
				/>
				{state.error && <Warning>{ErrorFeedback[state.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton
						// disabled={!isPageFinished}
						disabled={false}
						pending={state.pending}
					/>
				</div>
			</form>
		</section>
	);
};

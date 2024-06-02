"use client";

import { SessionUser } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/role";
import { isProduction } from "@/lib/constants";
import { Condition } from "@/lib/control/condition";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { createSummary } from "@/lib/summary/actions";
import { incrementUserPage } from "@/lib/user/actions";
import {
	PageData,
	focusElement,
	getChunkElement,
	removeHighlight,
	scrollToElement,
} from "@/lib/utils";
import {
	FloatingArrow,
	FloatingOverlay,
	FloatingPortal,
	arrow,
	autoUpdate,
	offset,
	useFloating,
} from "@floating-ui/react";
import {
	ErrorFeedback,
	ErrorType,
	SummaryResponse,
	SummaryResponseSchema,
} from "@itell/core/summary";
import { Card, CardContent, Warning, buttonVariants } from "@itell/ui/server";
import * as Sentry from "@sentry/nextjs";
import React, { forwardRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useImmerReducer } from "use-immer";
import { Button } from "../client-components";
import { PageLink } from "../page/page-link";
import { useConstructedResponse } from "../provider/page-provider";
import { SummaryInput, saveSummaryLocal } from "./summary-input";
import { SummarySubmitButton } from "./summary-submit-button";

type Props = {
	user: NonNullable<SessionUser>;
	page: PageData;
	pageStatus: PageStatus;
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

interface PopoverProps extends React.ComponentPropsWithoutRef<"div"> {
	onExit: () => void;
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(
	({ onExit, children, ...rest }, ref) => {
		return (
			<FloatingPortal>
				<Card className="focused-active-popover" ref={ref} {...rest}>
					<CardContent>
						<p>
							Please re-read the highlighted chunk. when you are finished, press
							the "I finished rereading" button.
						</p>
						<Button onClick={onExit} size="sm" className="mt-4">
							I finished rereading
						</Button>
					</CardContent>
					{children}
				</Card>
			</FloatingPortal>
		);
	},
);

export const SummaryFormReread = ({ user, page, pageStatus }: Props) => {
	const pageSlug = page.page_slug;
	const arrowRef = useRef<SVGSVGElement | null>(null);
	const [chunkRef, setChunkRef] = useState<HTMLElement | null>(null);
	const [showPopover, setShowPopover] = useState(false);
	const isSummaryReady = useConstructedResponse(
		(state) => state.isSummaryReady,
	);

	const onExit = () => {
		if (chunkRef) {
			setShowPopover(false);
			removeHighlight(chunkRef);
			const summaryEl = document.getElementById("page-summary");
			if (summaryEl) {
				scrollToElement(summaryEl);
			}
		}
	};

	const { refs, floatingStyles, context } = useFloating({
		// open: showPopover,
		// onOpenChange: () => {
		// 	console.log("what?>>");
		// 	setShowPopover(false);
		// },
		elements: {
			reference: chunkRef,
		},
		placement: "right",
		middleware: [offset(40), arrow({ element: arrowRef, padding: 10 })],
		whileElementsMounted: autoUpdate,
	});

	const [isTextbookFinished, setIsTextbookFinished] = useState(user.finished);
	const { chunks, finishPage } = useConstructedResponse((state) => ({
		chunks: state.chunks,
		finishPage: state.finishPage,
	}));
	const randomChunkSlug = chunks[Math.floor(Math.random() * chunks.length)];

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
	const { addStage, clearStages, finishStage, stages } = useSummaryStage();

	const goToRandomChunk = () => {
		// in production, only highlight 25% of the time
		// if (isProduction) {
		// 	if (Math.random() > 0.25) {
		// 		return;
		// 	}
		// }
		const el = getChunkElement(randomChunkSlug);
		if (el) {
			setShowPopover(true);
			setChunkRef(el);
			scrollToElement(el);
			focusElement(el);
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		clearStages();

		dispatch({ type: "submit" });
		addStage("Analyzing");

		const formData = new FormData(e.currentTarget);
		const input = String(formData.get("input")).trim();

		saveSummaryLocal(pageSlug, input);

		dispatch({ type: "set_prev_input", payload: input });

		let requestBody = "";
		let summaryResponse: SummaryResponse | null = null;

		try {
			requestBody = JSON.stringify({
				summary: input,
				page_slug: pageSlug,
			});
			console.log("requestBody", requestBody);
			const response = await fetch("/api/itell/score/summary", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: requestBody,
			});
			const json = await response.json();
			const parsed = SummaryResponseSchema.safeParse(json);
			if (!parsed.success) {
				throw parsed.error;
			}
			summaryResponse = parsed.data;
			await createSummary({
				text: input,
				userId: user.id,
				pageSlug,
				condition: Condition.RANDOM_REREAD,
				isPassed: summaryResponse.is_passed || false,
				containmentScore: summaryResponse.containment,
				similarityScore: summaryResponse.similarity,
				wordingScore: summaryResponse.wording,
				contentScore: summaryResponse.content,
			});
			await incrementUserPage(user.id, pageSlug);

			finishPage();
			finishStage("Analyzing");
			dispatch({
				type: "finish",
				payload: true,
			});

			if (isLastPage(pageSlug)) {
				setIsTextbookFinished(true);
				toast.info(
					"You have finished the textbook! Redirecting to the outtake survey soon.",
				);
				setTimeout(() => {
					window.location.href = `https://peabody.az1.qualtrics.com/jfe/form/SV_9GKoZxI3GC2XgiO?PROLIFIC_PID=${user.prolificId}`;
				}, 3000);
			}

			if (!isProduction || !pageStatus.unlocked) {
				goToRandomChunk();
			}
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

	return (
		<section className="space-y-2">
			{state.finished && page.nextPageSlug && (
				<div className="space-y-2 space-x-2">
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
				</div>
			)}

			{isAdmin(user.role) && (
				<Button variant={"outline"} onClick={goToRandomChunk}>
					go to random chunk (admin)
				</Button>
			)}

			{isTextbookFinished && (
				<div className="space-y-2">
					<p>You have finished the entire textbook. Congratulations! 🎉</p>
					<a
						href={`https://peabody.az1.qualtrics.com/jfe/form/SV_9GKoZxI3GC2XgiO?PROLIFIC_PID=${user.prolificId}`}
						className={buttonVariants({ variant: "outline" })}
					>
						Take outtake survey and claim your progress
					</a>
				</div>
			)}

			<form className="space-y-4" onSubmit={onSubmit}>
				<SummaryInput
					disabled={state.pending || !isSummaryReady}
					pageSlug={pageSlug}
					pending={state.pending}
					stages={stages}
					userRole={user.role}
				/>
				{state.error && <Warning>{ErrorFeedback[state.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton
						disabled={!isSummaryReady}
						pending={state.pending}
					/>
				</div>
			</form>
			{showPopover && (
				<Popover ref={refs.setFloating} onExit={onExit} style={floatingStyles}>
					<FloatingArrow ref={arrowRef} context={context} />
				</Popover>
			)}
		</section>
	);
};

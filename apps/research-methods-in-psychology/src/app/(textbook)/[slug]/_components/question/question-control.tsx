"use client";

import { useQuestionStore } from "@/components/provider/page-provider";
import {
	SelectChunkStatus,
	SelectChunks,
	SelectCurrentChunk,
	SelectShouldBlur,
} from "@/lib/store/question-store";
import { LoginButton } from "@auth/auth-form";
import { PortalContainer } from "@itell/core";
import { usePortal } from "@itell/core/hooks";
import { getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { useEffect, useRef } from "react";
import { ContinueChunkButton } from "./continue-chunk-button";
import { ScrollBackButton } from "./scroll-back-button";
import { UnlockSummaryButton } from "./unlock-summary-button";

type Props = {
	userId: string | null;
	pageSlug: string;
	condition: string;
};

export const QuestionControl = ({ userId, pageSlug, condition }: Props) => {
	const store = useQuestionStore();
	const currentChunk = useSelector(store, SelectCurrentChunk);
	const chunks = useSelector(store, SelectChunks);
	const status = useSelector(store, SelectChunkStatus);
	const shouldBlur = useSelector(store, SelectShouldBlur);

	const { portals, addPortal, removePortal } = usePortal();

	const portalIds = useRef<PortalIds>({} as PortalIds);

	const insertScrollBackButton = (el: HTMLElement) => {
		const buttonContainer = document.createElement("div");
		buttonContainer.classList.add("scroll-back-button-container");

		// note this the scroll back button is inserted as a sibling to the content chunk
		// so it won't be blurred as a children
		el.prepend(buttonContainer);
		portalIds.current.scrollBack = addPortal(
			<ScrollBackButton />,
			buttonContainer,
		);
	};

	const insertContinueButton = (el: HTMLElement, chunkSlug: string) => {
		const buttonContainer = document.createElement("div");
		buttonContainer.className = "continue-reading-button-container";
		if (!userId) {
			addPortal(<LoginButton />, buttonContainer);
			el.prepend(buttonContainer);
			return;
		}

		portalIds.current.continueReading = addPortal(
			<ContinueChunkButton
				chunkSlug={chunkSlug}
				pageSlug={pageSlug}
				condition={condition}
			/>,
			buttonContainer,
		);
		el.prepend(buttonContainer);
	};

	const insertUnlockSummaryButton = (el: HTMLElement, chunkSlug: string) => {
		const buttonContainer = document.createElement("div");
		buttonContainer.className = "unlock-summary-button-container";
		addPortal(
			<UnlockSummaryButton
				pageSlug={pageSlug}
				chunkSlug={chunkSlug}
				condition={condition}
			/>,
			buttonContainer,
		);
		el.appendChild(buttonContainer);
	};

	// unblur a chunk when current chunk advances
	// and controls the visibility of the "next-chunk" button
	const revealChunk = (currentChunk: string) => {
		const idx = chunks.indexOf(currentChunk);
		if (idx === -1) return;

		// when the last chunk is revealed, hide the scroll back button
		const currentChunkSlug = chunks.at(idx);
		if (!currentChunkSlug) return;
		const currentChunkElement = getChunkElement(
			currentChunkSlug,
			"data-chunk-slug",
		);
		if (!currentChunkElement) return;

		currentChunkElement.classList.remove("blurred");
		removePortal(portalIds.current.continueReading);

		const hasQuestion = status[currentChunkSlug]?.hasQuestion;

		console.log(chunks.length - 1, idx, currentChunk);
		if (idx === chunks.length - 1) {
			removePortal(portalIds.current.scrollBack);
			if (!hasQuestion) {
				insertUnlockSummaryButton(currentChunkElement, currentChunkSlug);
			}
		} else {
			// add next button to next chunk, if the current chunk does not contain a question
			if (shouldBlur && !hasQuestion) {
				const nextChunkSlug = chunks[idx + 1];
				const nextChunkElement = getChunkElement(
					nextChunkSlug,
					"data-chunk-slug",
				);
				if (nextChunkElement) {
					insertContinueButton(nextChunkElement, currentChunk);
				}
			}
		}
	};

	useEffect(() => {
		chunks.forEach((chunkSlug, chunkIndex) => {
			const el = getChunkElement(chunkSlug, "data-chunk-slug");
			if (!el) {
				return;
			}

			// blur chunks
			if (shouldBlur) {
				const currentIndex = chunks.indexOf(currentChunk);
				const isChunkUnvisited =
					currentIndex === -1 || chunkIndex > currentIndex;

				if (chunkIndex !== 0 && isChunkUnvisited) {
					el.classList.add("blurred");
				}
			}
		});

		if (shouldBlur) {
			const lastChunk = chunks[chunks.length - 1];
			const lastChunkElement = getChunkElement(lastChunk, "data-chunk-slug");
			if (lastChunkElement) {
				insertScrollBackButton(lastChunkElement);
			}
		}
	}, []);

	useEffect(() => {
		revealChunk(currentChunk);
	}, [currentChunk]);

	return <PortalContainer portals={portals} />;
};

type PortalIds = {
	scrollBack: string;
	continueReading: string;
};

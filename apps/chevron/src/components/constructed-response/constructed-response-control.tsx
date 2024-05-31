"use client";

import { Condition } from "@/lib/control/condition";
import { PageStatus } from "@/lib/page-status";
import { SelectedQuestions } from "@/lib/question";
import { getChunkElement } from "@/lib/utils";
import { usePortal } from "@itell/core/hooks";
import { useEffect } from "react";
import { useConstructedResponse } from "../provider/page-provider";
import { NextChunkButton } from "./next-chunk-button";
import { QuestionBoxReread } from "./question-box-reread";
import { QuestionBoxStairs } from "./question-box-stairs";
import { ScrollBackButton } from "./scroll-back-button";

type Props = {
	selectedQuestions: SelectedQuestions;
	pageSlug: string;
	pageStatus: PageStatus;
	condition: string;
};

export const ConstructedResponseControl = ({
	selectedQuestions,
	pageSlug,
	pageStatus,
	condition,
}: Props) => {
	// Ref for current chunk
	const { currentChunk, chunks, shouldBlur } = useConstructedResponse(
		(state) => ({
			currentChunk: state.currentChunk,
			chunks: state.chunks,
			shouldBlur: state.shouldBlur,
		}),
	);

	const { nodes, addNode } = usePortal();
	const hasFeedback = condition !== Condition.SIMPLE;
	const hideNextChunkButton = (chunkId: string) => {
		const el = getChunkElement(chunkId);
		if (!el) {
			return;
		}
		const button = el.querySelector(
			":scope .next-chunk-button-container",
		) as HTMLDivElement;

		if (button) {
			button.remove();
		}
	};

	const insertScrollBackButton = (el: HTMLElement) => {
		if (el.parentElement) {
			const buttonContainer = document.createElement("div");
			buttonContainer.className =
				"scroll-back-button-container flex justify-center items-center p-4 gap-2";
			buttonContainer.style.filter = "none";

			// note this the scroll back button is inserted as a sibling to the content chunk
			// so it won't be blurred as a children
			el.parentElement.insertBefore(buttonContainer, el.nextSibling);

			addNode(<ScrollBackButton />, buttonContainer);
		}
	};

	const hideScrollBackButton = () => {
		const button = document.querySelector(
			".scroll-back-button-container",
		) as HTMLDivElement;

		button?.remove();
	};

	const insertNextChunkButton = (el: HTMLElement, chunkSlug: string) => {
		// insert button container
		const buttonContainer = document.createElement("div");
		buttonContainer.className =
			"next-chunk-button-container flex justify-center items-center p-4 gap-2";
		el.style.filter = "none";
		el.appendChild(buttonContainer);

		addNode(
			<NextChunkButton
				clickEventType="chunk reveal"
				chunkSlug={chunkSlug}
				pageSlug={pageSlug}
				standalone
			>
				Click here to continue reading
			</NextChunkButton>,
			buttonContainer,
		);
	};

	const insertQuestion = (el: HTMLElement, chunkId: string) => {
		const questionContainer = document.createElement("div");
		questionContainer.className = "question-container";
		el.appendChild(questionContainer);

		const q = selectedQuestions.get(chunkId);
		if (q) {
			if (condition === Condition.STAIRS) {
				addNode(
					<QuestionBoxStairs
						question={q.question}
						answer={q.answer}
						chunkSlug={chunkId}
						pageSlug={pageSlug}
					/>,
					questionContainer,
				);
			}

			if (condition === Condition.RANDOM_REREAD) {
				addNode(
					<QuestionBoxReread
						question={q.question}
						answer={q.answer}
						chunkSlug={chunkId}
						pageSlug={pageSlug}
					/>,
					questionContainer,
				);
			}
		}
	};

	// process chunk append "go to next" buttons to every chunk
	// inserts questions to selected chunks
	// and blur the chunks if the page is not finished
	const processChunk = (chunkId: string, chunkIndex: number) => {
		const el = getChunkElement(chunkId);
		if (!el) {
			return;
		}

		const currentIndex = chunks.indexOf(currentChunk);
		const isChunkUnvisited = currentIndex === -1 || chunkIndex > currentIndex;

		if (selectedQuestions.has(chunkId)) {
			insertQuestion(el, chunkId);
		}

		if (shouldBlur) {
			if (chunkIndex !== 0 && isChunkUnvisited) {
				el.style.filter = "blur(4px)";
			}

			if (chunkIndex === chunks.length - 1) {
				insertScrollBackButton(el);
			}
		}
	};

	// reveal chunk unblurs a chunk when current chunk advances
	// and controls the visibility of the "next-chunk" button
	const revealChunk = (currentChunk: string) => {
		const idx = chunks.indexOf(currentChunk);
		if (idx === -1) {
			return;
		}

		const currentChunkId = chunks.at(idx);
		const prevChunkId = idx > 0 ? chunks.at(idx - 1) : undefined;

		if (currentChunkId) {
			const currentChunkElement = getChunkElement(currentChunkId);
			if (!currentChunkElement) {
				return;
			}
			currentChunkElement.style.filter = "none";
			if (shouldBlur) {
				if (
					!selectedQuestions.has(currentChunkId) &&
					idx !== chunks.length - 1
				) {
					insertNextChunkButton(currentChunkElement, currentChunk);
				}
			}
		}

		// hide the "next-chunk" button of the previous chunk
		if (prevChunkId) {
			hideNextChunkButton(prevChunkId);
		}

		// when the last chunk is revealed, hide the scroll back button
		if (idx === chunks.length - 1) {
			hideScrollBackButton();
		}
	};

	useEffect(() => {
		if (hasFeedback) {
			chunks.forEach(processChunk);
		}
	}, []);

	useEffect(() => {
		if (hasFeedback) {
			revealChunk(currentChunk);
		}
	}, [currentChunk]);

	return nodes;
};

"use client";

import { useQuestionStore } from "@/components/provider/page-provider";
import { Condition } from "@/lib/constants";
import {
	SelectChunkStatus,
	SelectChunks,
	SelectCurrentChunk,
	SelectShouldBlur,
} from "@/lib/store/question-store";
import { LoginButton } from "@auth/auth-form";
import { Elements } from "@itell/constants";
import { PortalContainer } from "@itell/core";
import { usePortal } from "@itell/core/hooks";
import { Warning } from "@itell/ui/server";
import { getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { useEffect, useRef } from "react";
import { ContinueChunkButton } from "./continue-chunk-button";
import { QuestionBoxReread } from "./question-box-reread";
import { QuestionBoxSimple } from "./question-box-simple";
import { QuestionBoxStairs } from "./question-box-stairs";
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

	const insertQuestion = (
		el: HTMLElement,
		chunkSlug: string,
		question: string,
		answer: string,
	) => {
		const questionContainer = document.createElement("div");
		const isLastQuestion = chunkSlug === chunks.at(-1);
		questionContainer.className = Elements.QUESTION_CONTAINER_CLASS;
		questionContainer.ariaLabel = "a question for the text above";
		el.appendChild(questionContainer);

		if (!userId) {
			addPortal(
				<Warning>
					<p>You need to be logged in to view this question and move forward</p>
					<LoginButton />
				</Warning>,
				questionContainer,
			);
			return;
		}

		if (condition === Condition.SIMPLE) {
			addPortal(
				<QuestionBoxSimple
					chunkSlug={chunkSlug}
					pageSlug={pageSlug}
					question={question}
					answer={answer}
					isLastQuestion={isLastQuestion}
				/>,
				questionContainer,
			);
			return;
		}

		if (condition === Condition.RANDOM_REREAD) {
			addPortal(
				<QuestionBoxReread
					chunkSlug={chunkSlug}
					pageSlug={pageSlug}
					question={question}
					answer={answer}
					isLastQuestion={isLastQuestion}
				/>,
				questionContainer,
			);
			return;
		}

		if (condition === Condition.STAIRS) {
			addPortal(
				<QuestionBoxStairs
					question={question}
					answer={answer}
					chunkSlug={chunkSlug}
					pageSlug={pageSlug}
					isLastQuestion={isLastQuestion}
				/>,
				questionContainer,
			);
			return;
		}
	};

	// unblur a chunk when current chunk advances
	// and controls the visibility of the "next-chunk" button
	const revealChunk = (currentChunk: string) => {
		const idx = chunks.indexOf(currentChunk);
		if (idx === -1) {
			return;
		}

		// when the last chunk is revealed, hide the scroll back button
		const currentChunkSlug = chunks.at(idx);
		if (!currentChunkSlug) return;
		const currentChunkElement = getChunkElement(currentChunkSlug);
		if (!currentChunkElement) return;

		currentChunkElement.classList.remove("blurred");
		removePortal(portalIds.current.continueReading);

		const hasQuestion = status[currentChunkSlug]?.question;

		if (idx === chunks.length - 1) {
			removePortal(portalIds.current.scrollBack);
			if (!hasQuestion) {
				insertUnlockSummaryButton(currentChunkElement, currentChunkSlug);
			}
		} else {
			// add next button to next chunk, if the current chunk does not contain a question
			if (shouldBlur && !hasQuestion) {
				const nextChunkSlug = chunks[idx + 1];
				const nextChunkElement = getChunkElement(nextChunkSlug);
				if (nextChunkElement) {
					insertContinueButton(nextChunkElement, currentChunk);
				}
			}
		}
	};

	useEffect(() => {
		chunks.forEach((chunkSlug, chunkIndex) => {
			const el = getChunkElement(chunkSlug);
			if (!el) {
				return;
			}

			// insert questions
			const data = status[chunkSlug];
			if (data?.question) {
				insertQuestion(
					el,
					chunkSlug,
					data.question.question,
					data.question.answer,
				);
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
			const lastChunkElement = getChunkElement(lastChunk);
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

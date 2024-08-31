"use client";

import { Condition } from "@/lib/control/condition";
import { getChunkElement } from "@/lib/utils";
import { usePortal } from "@itell/core/hooks";
import { PortalContainer } from "@itell/core/portal-container";
import { useEffect, useRef } from "react";
import { useConstructedResponse } from "../provider/page-provider";
import { ContinueChunkButton } from "./continue-chunk-button";
import { QuestionBoxReread } from "./question-box-reread";
import { QuestionBoxSimple } from "./question-box-simple";
import { QuestionBoxStairs } from "./question-box-stairs";
import { ScrollBackButton } from "./scroll-back-button";

type Props = {
	userId: string | null;
	pageSlug: string;
	condition: string;
};

export const ConstructedResponseControl = ({
	userId,
	pageSlug,
	condition,
}: Props) => {
	const { currentChunk, chunkSlugs, chunkData, shouldBlur } =
		useConstructedResponse((state) => ({
			currentChunk: state.currentChunk,
			chunkSlugs: state.chunkSlugs,
			chunkData: state.chunkData,
			shouldBlur: state.shouldBlur,
		}));

	const { addPortal, portals, removePortal } = usePortal();
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

	const insertContinueReadingButton = (el: HTMLElement, chunkSlug: string) => {
		// insert button container
		const buttonContainer = document.createElement("div");
		buttonContainer.className = "continue-reading-button-container";
		el.prepend(buttonContainer);

		portalIds.current.continueReading = addPortal(
			<ContinueChunkButton
				userId={userId}
				chunkSlug={chunkSlug}
				pageSlug={pageSlug}
				condition={condition}
			/>,
			buttonContainer,
		);
	};

	const insertQuestion = (
		el: HTMLElement,
		chunkSlug: string,
		question: string,
		answer: string,
	) => {
		const questionContainer = document.createElement("div");
		questionContainer.className = "question-container";
		el.appendChild(questionContainer);

		if (condition === Condition.SIMPLE) {
			addPortal(
				<QuestionBoxSimple
					userId={userId}
					chunkSlug={chunkSlug}
					pageSlug={pageSlug}
					question={question}
					answer={answer}
				/>,
				questionContainer,
			);
		}

		if (condition === Condition.RANDOM_REREAD) {
			addPortal(
				<QuestionBoxReread
					userId={userId}
					chunkSlug={chunkSlug}
					pageSlug={pageSlug}
					question={question}
					answer={answer}
				/>,
				questionContainer,
			);
		}

		if (condition === Condition.STAIRS) {
			addPortal(
				<QuestionBoxStairs
					userId={userId}
					question={question}
					answer={answer}
					chunkSlug={chunkSlug}
					pageSlug={pageSlug}
				/>,
				questionContainer,
			);
		}
	};

	// reveal chunk unblurs a chunk when current chunk advances
	// and controls the visibility of the "next-chunk" button
	const revealChunk = (currentChunk: string) => {
		const idx = chunkSlugs.indexOf(currentChunk);
		if (idx === -1) {
			return;
		}

		const currentChunkSlug = chunkSlugs.at(idx);
		if (currentChunkSlug) {
			const currentChunkElement = getChunkElement(currentChunkSlug);
			if (currentChunkElement) {
				currentChunkElement.classList.remove("blurred");
				removePortal(portalIds.current.continueReading);

				// add next button to next chunk, if the current chunk does not contain a question
				if (shouldBlur && !chunkData[currentChunkSlug].question) {
					const nextChunkSlug = chunkSlugs.at(idx + 1);
					if (nextChunkSlug) {
						const nextChunkElement = getChunkElement(nextChunkSlug);
						if (nextChunkElement) {
							insertContinueReadingButton(nextChunkElement, currentChunk);
						}
					}
				}
			}
		}

		// when the last chunk is revealed, hide the scroll back button
		if (idx === chunkSlugs.length - 1) {
			removePortal(portalIds.current.scrollBack);
		}
	};

	useEffect(() => {
		chunkSlugs.forEach((chunkSlug, chunkIndex) => {
			const el = getChunkElement(chunkSlug);
			if (!el) {
				return;
			}

			// insert questions
			const data = chunkData[chunkSlug];
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
				const currentIndex = chunkSlugs.indexOf(currentChunk);
				const isChunkUnvisited =
					currentIndex === -1 || chunkIndex > currentIndex;

				if (chunkIndex !== 0 && isChunkUnvisited) {
					el.classList.add("blurred");
				}
			}
		});

		if (shouldBlur) {
			const lastChunk = chunkSlugs[chunkSlugs.length - 1];
			const lastChunkElement = getChunkElement(lastChunk);
			if (lastChunkElement) {
				insertScrollBackButton(lastChunkElement);
			}
		}
	}, []);

	useEffect(() => {
		revealChunk(currentChunk);

		// if (!isProduction) {
		// 	chunkSlugs.forEach((slug, idx) => {
		// 		const el = getChunkElement(slug);
		// 		if (!el) {
		// 			return;
		// 		}
		// 		const currentIndex = chunkSlugs.indexOf(currentChunk);
		// 		const isChunkUnvisited = currentIndex === -1 || idx > currentIndex;

		// 		if (shouldBlur) {
		// 			if (idx !== 0 && isChunkUnvisited) {
		// 				el.classList.add("blurred");
		// 			} else {
		// 				el.classList.remove("blurred");
		// 				removePortal(portalIds.current.continueReading);
		// 			}
		// 		}
		// 	});
		// }
	}, [currentChunk]);

	return <PortalContainer portals={portals} />;
};
type PortalIds = {
	scrollBack: string;
	continueReading: string;
};

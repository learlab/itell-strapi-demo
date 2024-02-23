import { create, createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PageStatus } from "../page-status";

interface Props {
	currentChunk: string;
	chunks: string[];
	isPageFinished: boolean;
}

export interface ConstructedResponseState extends Props {
	advanceChunk: (slug: string) => void;
	reset: () => void;
}

export type ConstructedResponseStore = ReturnType<
	typeof createConstructedResponseStore
>;

export const createConstructedResponseStore = (
	pageSlug: string,
	chunks: string[],
	pageStatus: PageStatus,
	isLastChunkWithQuestion: boolean,
) => {
	return createStore<ConstructedResponseState>()(
		persist(
			(set, get) => ({
				currentChunk: chunks[0],
				chunks,
				isPageFinished: pageStatus.isPageUnlocked,
				advanceChunk: (slug: string) => {
					const currentIndex = chunks.indexOf(slug);
					let nextIndex = currentIndex;
					if (currentIndex + 1 < chunks.length) {
						nextIndex = currentIndex + 1;
						set({ currentChunk: chunks[nextIndex] });
					}

					if (!isLastChunkWithQuestion && nextIndex === chunks.length - 1) {
						set({ isPageFinished: true });
						return;
					}

					const isLastQuestion = slug === chunks[chunks.length - 1];
					if (isLastQuestion) {
						set({ isPageFinished: true });
					}
				},
				reset: () => {
					set({ currentChunk: chunks[0], isPageFinished: false });
				},
			}),
			{
				name: `constructed-response-store-${pageSlug}`,
				storage: createJSONStorage(() => localStorage),
			},
		),
	);
};

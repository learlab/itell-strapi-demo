import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PageStatus } from "../page-status";

interface Props {
	currentChunk: string;
	chunks: string[];
	// chunks whose questions have been answered correctly
	excludedChunks: string[];
	isPageFinished: boolean;
}

export interface ConstructedResponseState extends Props {
	advanceChunk: (slug: string) => void;
	finishChunk: (slug: string) => void;
	finishPage: () => void;
	resetPage: () => void;
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
				excludedChunks: [],
				isPageFinished: pageStatus.isPageUnlocked,

				finishChunk: (slug: string) => {
					set({ excludedChunks: [...get().excludedChunks, slug] });
				},

				advanceChunk: (slug: string) => {
					const currentIndex = chunks.indexOf(slug);
					let nextIndex = currentIndex;

					if (currentIndex + 1 < chunks.length) {
						nextIndex = currentIndex + 1;
						set({ currentChunk: chunks[nextIndex] });
					}

					// the next chunk is the last chunk, which does not have a question
					// finish the page
					if (!isLastChunkWithQuestion && nextIndex === chunks.length - 1) {
						set({ isPageFinished: true });
						return;
					}

					// user is on the last chunk, and it has a question
					// this happens when user clicks on next-chunk-button of the question box of the last chunk
					const isLastQuestion = slug === chunks[chunks.length - 1];
					if (isLastQuestion) {
						set({ isPageFinished: true });
					}
				},
				finishPage: () => {
					set({
						isPageFinished: true,
						currentChunk: chunks[chunks.length - 1],
					});
				},
				resetPage: () => {
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

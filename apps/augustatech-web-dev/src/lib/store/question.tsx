import { PageStatus } from "@/lib/page-status";
import { Question, SelectedQuestions } from "@/lib/question";
import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ChunkData = Record<
	string,
	{
		question: Question | undefined;
		// a chunk status can be undefined (no interaction happened), completed (the page is unlocked or a question has been answered regardless of correctness), or passed (the question has been answered correctly)
		status: undefined | "completed" | "passed";
	}
>;

interface Props {
	currentChunk: string;
	chunkData: ChunkData;
	chunkSlugs: string[];
	isSummaryReady: boolean;
	shouldBlur: boolean;
}

export interface QuestionState extends Props {
	advanceChunk: (slug: string) => void;
	finishChunk: (slug: string, passed?: boolean) => void;
	finishPage: () => void;
	resetPage: () => void;
	getExcludedChunks: () => string[];
}

export type QuestionStore = ReturnType<typeof createQuestionStore>;

export const createQuestionStore = (
	pageSlug: string,
	chunkSlugs: string[],
	selectedQuestions: SelectedQuestions,
	pageStatus: PageStatus,
) => {
	const isLastChunkWithQuestion = selectedQuestions.has(
		chunkSlugs[chunkSlugs.length - 1],
	);

	const chunkData: ChunkData = {};
	chunkSlugs.forEach((slug) => {
		const q = selectedQuestions.get(slug);
		chunkData[slug] = {
			question: q,
			status: pageStatus.unlocked ? "completed" : undefined,
		};
	});

	return createStore<QuestionState>()(
		persist(
			(set, get) => ({
				currentChunk: chunkSlugs[chunkSlugs.length - 1],
				chunkSlugs,
				chunkData,
				isSummaryReady: true as boolean,
				shouldBlur: false,
				// isSummaryReady: pageStatus.unlocked,
				// shouldBlur: !pageStatus.unlocked,

				finishChunk: (slug: string, passed?: boolean) => {
					const newData = { ...get().chunkData };
					newData[slug].status = passed ? "passed" : "completed";
					set({ chunkData: newData });
				},

				advanceChunk: (slug: string) => {
					const currentIndex = chunkSlugs.indexOf(slug);
					let nextIndex = currentIndex;

					if (currentIndex + 1 < chunkSlugs.length) {
						nextIndex = currentIndex + 1;
						set({ currentChunk: chunkSlugs[nextIndex] });
					}

					// the next chunk is the last chunk, which does not have a question
					// finish the page
					if (!isLastChunkWithQuestion && nextIndex === chunkSlugs.length - 1) {
						set({ isSummaryReady: true, shouldBlur: false });
					}

					// user is on the last chunk, and it has a question
					// this happens when user clicks on next-chunk-button of the question box of the last chunk
					const isLastQuestion = slug === chunkSlugs.at(-1);
					if (isLastQuestion) {
						set({ isSummaryReady: true, shouldBlur: false });
					}
				},
				finishPage: () => {
					set({
						isSummaryReady: true,
						shouldBlur: false,
						currentChunk: chunkSlugs.at(-1),
					});
				},
				resetPage: () => {
					set({
						currentChunk: chunkSlugs[0],
						isSummaryReady: false,
						shouldBlur: true,
					});
				},
				getExcludedChunks: () => {
					const excludedChunks: string[] = [];
					for (const [slug, data] of Object.entries(get().chunkData)) {
						if (data.status === "passed") {
							excludedChunks.push(slug);
						}
					}
					return excludedChunks;
				},
			}),
			{
				name: `constructed-response-store-${pageSlug}`,
				storage: createJSONStorage(() => localStorage),
			},
		),
	);
};

import { SnapshotFromStore, createStoreWithProducer } from "@xstate/store";
import produce from "immer";
import { PageStatus } from "../page-status";
import { Question, SelectedQuestions } from "../question";

export type QuestionStore = ReturnType<typeof createQuestionStore>;
export type QuestionSnapshot = {
	currentChunk: string;
	chunks: string[];
	chunkStatus: ChunkStatus;
	isSummaryReady: boolean;
	shouldBlur: boolean;
};

export const createQuestionStore = (
	{
		pageStatus,
		chunks,
		selectedQuestions,
	}: {
		pageStatus: PageStatus;
		chunks: string[];
		selectedQuestions: SelectedQuestions;
	},
	snapshot?: QuestionSnapshot,
) => {
	const defaultSnapshot: QuestionSnapshot = {
		currentChunk: chunks[0],
		chunks,
		chunkStatus: Object.fromEntries(
			chunks.map((slug) => [
				slug,
				{
					question: selectedQuestions.get(slug),
					status: pageStatus.unlocked ? "completed" : undefined,
				},
			]),
		),
		isSummaryReady: pageStatus.unlocked,
		shouldBlur: !pageStatus.unlocked,
	};

	return createStoreWithProducer(produce, snapshot || defaultSnapshot, {
		finishChunk: (context, event: { chunkSlug: string; passed?: boolean }) => {
			context.chunkStatus[event.chunkSlug].status = event.passed
				? "passed"
				: "completed";
		},

		advanceChunk: (context, event: { chunkSlug: string }) => {
			const currentIndex = context.chunks.indexOf(event.chunkSlug);

			if (currentIndex + 1 < context.chunks.length) {
				context.currentChunk = context.chunks[currentIndex + 1];
			}
		},
		finishPage: (context) => {
			context.isSummaryReady = true;
			context.shouldBlur = false;
			context.currentChunk = context.chunks[context.chunks.length - 1];
		},
		resetPage: (context) => {
			context.isSummaryReady = false;
			context.shouldBlur = true;
			context.currentChunk = context.chunks[0];
			context.chunkStatus = Object.fromEntries(
				context.chunks.map((slug) => [
					slug,
					{
						question: selectedQuestions.get(slug),
						status: undefined,
					},
				]),
			);
		},
	});
};

export const getExcludedChunks = (store: QuestionStore) => {
	const snap = store.getSnapshot();
	return snap.context.chunks.filter(
		(slug) => snap.context.chunkStatus[slug].status === "passed",
	);
};

type ChunkStatus = Record<
	string,
	{
		question: Question | undefined;
		// a chunk status can be undefined (no interaction happened), completed (the page is unlocked or a question has been answered regardless of correctness), or passed (the question has been answered correctly)
		status: undefined | "completed" | "passed";
	}
>;

type Selector<T> = (state: SnapshotFromStore<QuestionStore>) => T;

export const SelectChunkStatus: Selector<ChunkStatus> = (state) =>
	state.context.chunkStatus;
export const SelectChunks: Selector<string[]> = (state) => state.context.chunks;
export const SelectShouldBlur: Selector<boolean> = (state) =>
	state.context.shouldBlur;
export const SelectCurrentChunk: Selector<string> = (state) =>
	state.context.currentChunk;
export const SelectSummaryReady: Selector<boolean> = (state) =>
	state.context.isSummaryReady;

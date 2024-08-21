import { SnapshotFromStore, createStoreWithProducer } from "@xstate/store";
import produce from "immer";
import { Page } from "#content";
import { PageStatus } from "../page-status";

export type Question = { answer: string; question: string };
export type SelectedQuestions = Record<string, Question>;
export type QuestionStore = ReturnType<typeof createQuestionStore>;
export type QuestionSnapshot = {
	currentChunk: string;
	chunkStatus: ChunkStatus;
	isSummaryReady: boolean;
	shouldBlur: boolean;
};

export type ChunkQuestion = Record<string, boolean>;

type Props = {
	pageStatus: PageStatus;
	chunks: Page["chunks"];
	chunkQuestion: ChunkQuestion;
};

export const createQuestionStore = (
	{ pageStatus, chunks, chunkQuestion }: Props,
	snapshot?: QuestionSnapshot,
) => {
	const lastIndex = chunks.length - 1;
	const slugs = chunks.map(({ slug }) => slug);

	const initialChunk =
		chunks.find(({ type }) => type === "regular")?.slug ||
		chunks[chunks.length - 1].slug;

	const initialState: QuestionSnapshot = {
		currentChunk: snapshot?.currentChunk || initialChunk,
		chunkStatus:
			snapshot?.chunkStatus ||
			Object.fromEntries(
				chunks.map(({ slug, type }) => [
					slug,
					{
						hasQuestion: chunkQuestion[slug],
						status: type === "regular" ? undefined : "completed",
					},
				]),
			),
		isSummaryReady: snapshot?.isSummaryReady || pageStatus.unlocked,
		shouldBlur: snapshot?.shouldBlur || !pageStatus.unlocked,
	};

	return createStoreWithProducer(produce, initialState, {
		finishChunk: (context, event: { chunkSlug: string; passed?: boolean }) => {
			context.chunkStatus[event.chunkSlug].status = event.passed
				? "passed"
				: "completed";
		},

		advanceChunk: (context, event: { chunkSlug: string }) => {
			const currentIndex = slugs.indexOf(event.chunkSlug);
			if (currentIndex < lastIndex) {
				let nextIndex = currentIndex + 1;
				if (nextIndex === lastIndex) {
					context.currentChunk = slugs[lastIndex];
					return;
				}

				while (
					nextIndex + 1 <= lastIndex &&
					chunks[nextIndex + 1].type !== "regular"
				) {
					nextIndex++;
				}
				context.currentChunk = chunks[nextIndex].slug;
			}
		},
		finishPage: (context) => {
			context.isSummaryReady = true;
			context.shouldBlur = false;
			context.currentChunk = slugs[lastIndex];
		},
		resetPage: (context) => {
			context.isSummaryReady = false;
			context.shouldBlur = true;
			context.currentChunk = slugs[0];
			context.chunkStatus = Object.fromEntries(
				slugs.map((slug) => [
					slug,
					{
						hasQuestion: chunkQuestion[slug],
						status: undefined,
					},
				]),
			);
		},
	});
};

export const getExcludedChunks = (store: QuestionStore) => {
	const snap = store.getSnapshot();
	return Object.entries(snap.context.chunkStatus)
		.filter(([_, { status }]) => status === "passed")
		.map(([slug]) => slug);
};

type ChunkStatus = Record<
	string,
	{
		hasQuestion: boolean;
		// a chunk status can be undefined (no interaction happened), completed (the page is unlocked or a question has been answered regardless of correctness), or passed (the question has been answered correctly)
		status: undefined | "completed" | "passed";
	}
>;

type Selector<T> = (state: SnapshotFromStore<QuestionStore>) => T;

export const SelectChunkStatus: Selector<ChunkStatus> = (state) =>
	state.context.chunkStatus;
export const SelectShouldBlur: Selector<boolean> = (state) =>
	state.context.shouldBlur;
export const SelectCurrentChunk: Selector<string> = (state) =>
	state.context.currentChunk;
export const SelectSummaryReady: Selector<boolean> = (state) =>
	state.context.isSummaryReady;

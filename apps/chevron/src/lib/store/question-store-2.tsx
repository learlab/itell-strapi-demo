import { SnapshotFromStore, createStoreWithProducer } from "@xstate/store";
import produce from "immer";
import { PageStatus } from "../page-status";
import { Question, SelectedQuestions } from "../question";

export type QuestionStore2 = ReturnType<typeof createQuestionStore2>;
export const createQuestionStore2 = ({
	pageStatus,
	chunks,
	selectedQuestions,
}: {
	pageStatus: PageStatus;
	chunks: string[];
	selectedQuestions: SelectedQuestions;
}) => {
	const isLastChunkWithQuestion = selectedQuestions.has(
		chunks[chunks.length - 1],
	);
	const chunkStatus: ChunkStatus = Object.fromEntries(
		chunks.map((slug) => [
			slug,
			{
				question: selectedQuestions.get(slug),
				status: pageStatus.unlocked ? "completed" : undefined,
			},
		]),
	);

	return createStoreWithProducer(
		produce,
		{
			currentChunk: chunks[0],
			chunks,
			chunkStatus,
			isSummaryReady: pageStatus.unlocked,
			shouldBlur: !pageStatus.unlocked,
		},
		{
			finishChunk: (
				context,
				event: { chunkSlug: string; passed?: boolean },
			) => {
				context.chunkStatus[event.chunkSlug].status = event.passed
					? "passed"
					: "completed";
			},

			advanceChunk: (context, event: { chunkSlug: string }) => {
				const currentIndex = context.chunks.indexOf(event.chunkSlug);
				let nextIndex = currentIndex;

				if (currentIndex + 1 < context.chunks.length) {
					nextIndex = currentIndex + 1;
					context.currentChunk = context.chunks[nextIndex];
				}

				// the next chunk is the last chunk, which does not have a question
				// finish the page
				if (
					!isLastChunkWithQuestion &&
					nextIndex === context.chunks.length - 1
				) {
					context.isSummaryReady = true;
					context.shouldBlur = false;
				}

				// user is on the last chunk, and it has a question
				// this happens when user clicks on next-chunk-button of the question box of the last chunk
				const isLastQuestion = event.chunkSlug === context.chunks.at(-1);
				if (isLastQuestion) {
					context.isSummaryReady = true;
					context.shouldBlur = false;
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
		},
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

type Selector<T> = (state: SnapshotFromStore<QuestionStore2>) => T;
export const SelectChunks: Selector<string[]> = (state) => state.context.chunks;
export const SelectShouldBlur: Selector<boolean> = (state) =>
	state.context.shouldBlur;
export const SelectCurrentChunk: Selector<string> = (state) =>
	state.context.currentChunk;
export const SelectSummaryReady: Selector<boolean> = (state) =>
	state.context.isSummaryReady;

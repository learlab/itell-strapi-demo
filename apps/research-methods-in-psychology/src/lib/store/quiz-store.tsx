import { SnapshotFromStore, createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";

export type QuizStore = ReturnType<typeof createQuizStore>;
export const createQuizStore = () => {
	return createStoreWithProducer(
		produce,
		{
			quizOpen: false,
		},
		{
			toggleQuiz: (context) => {
				context.quizOpen = !context.quizOpen;
			},
		},
	);
};

type Selector<T> = (snap: SnapshotFromStore<QuizStore>) => T;

export const SelectQuizOpen: Selector<boolean> = (state) =>
	state.context.quizOpen;

import { createStoreWithProducer, SnapshotFromStore } from "@xstate/store";
import { produce } from "immer";

export type QuizStore = ReturnType<typeof createQuizStore>;
export const createQuizStore = ({
  finished,
}: {
  finished: boolean | undefined;
}) => {
  return createStoreWithProducer(produce, {
    context: {
      open: false,
      finished,
    },
    on: {
      toggleQuiz: (context) => {
        context.open = !context.open;
      },
      finishQuiz: (context, event: any, { emit }) => {
        context.open = false;
        context.finished = true;
        emit({ type: "finishQuiz" });
      },
    },
  });
};

type Selector<T> = (snap: SnapshotFromStore<QuizStore>) => T;

export const SelectQuizOpen: Selector<boolean> = (state) => state.context.open;
export const SelectQuizFinished: Selector<boolean | undefined> = (state) =>
  state.context.finished;

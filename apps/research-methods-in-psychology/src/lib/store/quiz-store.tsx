import { createStoreWithProducer, type SnapshotFromStore } from "@xstate/store";
import { produce } from "immer";

import { type PageStatus } from "../page-status";

export type QuizStore = ReturnType<typeof createQuizStore>;
export const createQuizStore = ({
  finished,
  pageStatus,
}: {
  finished: boolean | undefined;
  pageStatus: PageStatus;
}) => {
  return createStoreWithProducer(produce, {
    context: {
      open: pageStatus.unlocked && finished === false,
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

type Selector<T> = (_: SnapshotFromStore<QuizStore>) => T;

export const SelectQuizOpen: Selector<boolean> = (state) => state.context.open;
export const SelectQuizFinished: Selector<boolean | undefined> = (state) =>
  state.context.finished;

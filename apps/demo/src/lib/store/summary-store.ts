import { type ErrorType, type SummaryResponse } from "@itell/core/summary";
import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";

import { type PageStatus } from "@/lib/page-status";
import type { SnapshotFromStore } from "@xstate/store";

export type StairsQuestion = {
  text: string;
  chunk: string;
  question_type: string;
};

export type SummaryStore = ReturnType<typeof createSummaryStore>;
export const createSummaryStore = ({
  pageStatus,
}: {
  pageStatus: PageStatus;
}) => {
  return createStoreWithProducer(produce, {
    context: {
      prevInput: undefined as string | undefined,
      error: null as ErrorType | null,
      response: null as SummaryResponse | null,
      stairsQuestion: null as StairsQuestion | null,
      isNextPageVisible: pageStatus.unlocked,
    },
    on: {
      submit: (context) => {
        context.error = null;
      },
      fail: (context, event: { error: ErrorType }) => {
        context.error = event.error;
      },
      scored: (context, event: { response: SummaryResponse }) => {
        context.response = event.response;
      },
      stairs: (context, event: { data: StairsQuestion }) => {
        context.stairsQuestion = event.data;
      },
      finishPage: (
        context,
        event: { isNextPageVisible?: boolean; input?: string }
      ) => {
        if (event.isNextPageVisible !== undefined) {
          context.isNextPageVisible = event.isNextPageVisible;
        }
        if (event.input !== undefined) {
          context.prevInput = event.input;
        }
      },
    },
  });
};

type Selector<T> = (_: SnapshotFromStore<SummaryStore>) => T;
export const SelectResponse: Selector<SummaryResponse | null> = (state) =>
  state.context.response;
export const SelectPrevInput: Selector<string | undefined> = (state) =>
  state.context.prevInput;
export const SelectIsNextPageVisible: Selector<boolean> = (state) =>
  state.context.isNextPageVisible;
export const SelectStairs: Selector<StairsQuestion | null> = (state) =>
  state.context.stairsQuestion;
export const SelectError: Selector<ErrorType | null> = (state) =>
  state.context.error;

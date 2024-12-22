import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";
import type { SnapshotFromStore } from "@xstate/store";

export type StreakStore = ReturnType<typeof createStreakStore>;
export const createStreakStore = ({
  criStreak
}: {
  criStreak: number;
}) => {
  return createStoreWithProducer(produce, 
    {
      criStreak: criStreak as number,
    },
    {
      updateCriStreak: (context, event: { criStreak: number }) => {
        context.criStreak = event.criStreak;
      }
    }
  );
};

type Selector<T> = (_: SnapshotFromStore<StreakStore>) => T;

export const SelectCriStreak: Selector<number> = (state) => state.context.criStreak;
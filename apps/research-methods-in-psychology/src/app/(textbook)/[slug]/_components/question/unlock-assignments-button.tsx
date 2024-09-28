"use client";

import { createEventAction } from "@/actions/event";
import { useQuestionStore } from "@/components/provider/page-provider";
import { EventType } from "@/lib/constants";
import { SelectSummaryReady } from "@/lib/store/question-store";
import { Button } from "@itell/ui/button";
import { useSelector } from "@xstate/store/react";

export const UnlockAssignmentsButton = ({
  pageSlug,
  chunkSlug,
  condition,
}: {
  pageSlug: string;
  chunkSlug: string;
  condition: string;
}) => {
  const store = useQuestionStore();
  const isSummaryReady = useSelector(store, SelectSummaryReady);

  return (
    <Button
      disabled={isSummaryReady}
      onClick={() => {
        store.send({ type: "finishPage" });

        createEventAction({
          pageSlug,
          type: EventType.CHUNK_REVEAL,
          data: {
            chunkSlug,
            condition,
          },
        });
      }}
    >
      Unlock assignments
    </Button>
  );
};

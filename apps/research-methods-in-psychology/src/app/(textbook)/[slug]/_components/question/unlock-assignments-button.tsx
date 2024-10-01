"use client";

import { createEventAction } from "@/actions/event";
import { useQuestionStore } from "@/components/provider/page-provider";
import { EventType } from "@/lib/constants";
import { SelectSummaryReady } from "@/lib/store/question-store";
import { Button } from "@itell/ui/button";
import { useSelector } from "@xstate/store/react";
import { KeyIcon } from "lucide-react";

export function UnlockAssignmentsButton({
  pageSlug,
  chunkSlug,
  condition,
}: {
  pageSlug: string;
  chunkSlug: string;
  condition: string;
}) {
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
      <KeyIcon className="mr-2 h-4 w-4" />
      <span>Unlock assignments</span>
    </Button>
  );
}

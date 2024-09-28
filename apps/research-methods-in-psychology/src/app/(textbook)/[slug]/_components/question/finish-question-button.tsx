"use client";

import { createEventAction } from "@/actions/event";
import {
  useChunks,
  useQuestionStore,
} from "@/components/provider/page-provider";
import { EventType } from "@/lib/constants";
import {
  SelectCurrentChunk,
  SelectSummaryReady,
} from "@/lib/store/question-store";
import { Button } from "@itell/ui/button";
import { useSelector } from "@xstate/store/react";

type Props = {
  chunkSlug: string;
  pageSlug: string;
  condition: string;
};

export const FinishQuestionButton = ({
  chunkSlug,
  pageSlug,
  condition,
}: Props) => {
  const store = useQuestionStore();
  const currentChunk = useSelector(store, SelectCurrentChunk);
  const isSummaryReady = useSelector(store, SelectSummaryReady);
  const chunks = useChunks();
  const isLastQuestion = chunks[chunks.length - 1] === chunkSlug;

  const text = isLastQuestion ? "Unlock summary" : "Continue reading";

  const disabled = isSummaryReady || currentChunk !== chunkSlug;

  return (
    <Button
      disabled={disabled}
      onClick={() => {
        if (isLastQuestion) {
          store.send({ type: "finishPage" });
        } else {
          store.send({ type: "advanceChunk", chunkSlug });
        }
        createEventAction({
          pageSlug,
          type: EventType.CHUNK_REVEAL_QUESTION,
          data: {
            chunkSlug,
            condition,
          },
        });
      }}
    >
      {text}
    </Button>
  );
};

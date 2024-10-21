"use client";

import { Button } from "@itell/ui/button";
import { Card, CardContent } from "@itell/ui/card";
import { cn } from "@itell/utils";

import { createEventAction } from "@/actions/event";
import {
  useChunks,
  useQuestionStore,
} from "@/components/provider/page-provider";
import { Condition, EventType } from "@/lib/constants";
import {
  SelectCurrentChunk,
  SelectSummaryReady,
} from "@/lib/store/question-store";
import { useSelector } from "@xstate/store/react";

type Props = {
  question: string;
  answer: string;
  pageSlug: string;
  chunkSlug: string;
};

export function QuestionBoxSimple({
  question,
  answer,
  pageSlug,
  chunkSlug,
}: Props) {
  const store = useQuestionStore();
  const currentChunk = useSelector(store, SelectCurrentChunk);
  const isSummaryReady = useSelector(store, SelectSummaryReady);
  const disabled = isSummaryReady || currentChunk !== chunkSlug;
  const chunks = useChunks();
  const isLastQuestion = chunkSlug === chunks[chunks.length - 1];
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center space-y-2 px-6 py-4"
      )}
    >
      <CardContent className="mx-auto flex w-4/5 flex-col items-start justify-center space-y-1">
        <p className="text-sm text-muted-foreground">
          Below is a question related to the content you just read. When you
          finished reading its answer, click the finish button below to move on.
        </p>
        <p>
          <span className="font-bold">Question: </span>
          {question}
        </p>
        <p>
          <span className="font-bold">Answer: </span>
          {answer}
        </p>

        <h2 id="question-form-heading" className="sr-only">
          Finish reading
        </h2>
        <form
          aria-labelledby="question-form-heading"
          onSubmit={(e) => {
            e.preventDefault();
            if (isLastQuestion) {
              store.send({ type: "finishPage" });
            } else {
              store.send({ type: "advanceChunk", chunkSlug });
            }
            createEventAction({
              type: EventType.CHUNK_REVEAL_QUESTION,
              pageSlug,
              data: {
                chunkSlug,
                condition: Condition.SIMPLE,
              },
            });
          }}
          className="w-full space-y-2"
        >
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button type="submit" variant="outline" disabled={disabled}>
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

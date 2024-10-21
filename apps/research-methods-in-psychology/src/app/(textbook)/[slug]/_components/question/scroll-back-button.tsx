"use client";

import { Button } from "@itell/ui/button";
import { getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { MoveUpIcon } from "lucide-react";

import { useQuestionStore } from "@/components/provider/page-provider";
import { SelectCurrentChunk } from "@/lib/store/question-store";
import { scrollToElement } from "@/lib/utils";

export function ScrollBackButton() {
  const store = useQuestionStore();
  const currentChunk = useSelector(store, SelectCurrentChunk);

  const scrollToCurrentChunk = () => {
    const element = getChunkElement(currentChunk, "data-chunk-slug");
    if (element) {
      scrollToElement(element);
    }
  };

  return (
    <Button
      onClick={scrollToCurrentChunk}
      type="button"
      className="gap-2 uppercase"
    >
      <MoveUpIcon className="size-4" />
      Back to current section
    </Button>
  );
}

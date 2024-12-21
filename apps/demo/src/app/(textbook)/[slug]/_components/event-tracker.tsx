"use client";

import { useEffect, useState } from "react";
import { EventTracker as Tracker } from "@itell/core/event-tracker";
import { getChunkElement } from "@itell/utils";

import { createEventAction } from "@/actions/event";
import { createFocusTimeAction } from "@/actions/focus-time";
import { useChunks } from "@/components/provider/page-provider";
import { EventType, FOCUS_TIME_SAVE_INTERVAL } from "@/lib/constants";

type Props = {
  pageSlug: string;
};

export function EventTracker({ pageSlug }: Props) {
  const [mounted, setMounted] = useState(false);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const chunks = useChunks();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const chunkElements = chunks
      .map((slug) => getChunkElement(slug, "data-chunk-slug"))
      .filter((element) => element !== null);
    setElements(chunkElements);
  }, [chunks]);

  if (!mounted || elements.length === 0) return;

  return (
    <Tracker
      onClickEvent={async (data, event) => {
        const target = event.target as HTMLElement;
        const buttonContainer = target.closest("button");
        if (buttonContainer) {
          if (buttonContainer.dataset.event === "true") {
            await createEventAction({
              type: EventType.CLICK,
              pageSlug,
              data,
            });
          }
        }
      }}
      onScrollEvent={async (data) => {
        await createEventAction({
          type: EventType.SCROLL,
          pageSlug,
          data,
        });
      }}
      onFocusTimeEvent={async (data, total) => {
        if (total > 0) {
          await createFocusTimeAction({
            pageSlug,
            data,
          });
        }
      }}
      chunks={elements}
      attr="chunkSlug"
      focusTimeSaveInterval={FOCUS_TIME_SAVE_INTERVAL}
    />
  );
}

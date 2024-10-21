"use client";

import { useEffect, useState } from "react";
import { ErrorFeedback, ErrorType } from "@itell/core/summary";
import { Button } from "@itell/ui/button";
import { Warning } from "@itell/ui/callout";
import { parseEventStream } from "@itell/utils";
import { HelpCircleIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useActionStatus } from "use-action-status";

import { createEventAction } from "@/actions/event";
import { DelayMessage } from "@/components/delay-message";
import { apiClient } from "@/lib/api-client";
import { EventType } from "@/lib/constants";
import { reportSentry } from "@/lib/utils";

type Props = {
  pageSlug: string;
  chunkSlug: string;
  input: string;
};

export function ExplainButton({ pageSlug, chunkSlug, input }: Props) {
  const [response, setResponse] = useState("");
  const { pending: formPending } = useFormStatus();
  const { action, isPending, isDelayed, isError, error } = useActionStatus(
    async () => {
      const res = await apiClient.api.cri.explain.$post({
        json: {
          page_slug: pageSlug,
          chunk_slug: chunkSlug,
          student_response: input,
        },
      });
      let response = "";
      if (res.ok && res.body) {
        await parseEventStream(res.body, (data, done) => {
          if (!done) {
            try {
              const { text } = JSON.parse(data) as {
                request_id: string;
                text: string;
              };
              response = text;
              setResponse(response);
            } catch {
              console.log("invalid json", data);
            }
          }
        });
        createEventAction({
          type: EventType.EXPLAIN,
          pageSlug,
          data: { chunkSlug, response },
        });
      } else {
        console.log(await res.text());
        throw new Error("Failed to get explain response");
      }
    }
  );

  useEffect(() => {
    if (isError) {
      reportSentry("explain cr", { error });
    }
  }, [isError]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div role="status">
        {response ? (
          <p className="text-sm text-muted-foreground">{response}</p>
        ) : null}
      </div>

      <Button
        variant="secondary"
        className="gap-2"
        type="button"
        disabled={formPending || isPending}
        onClick={action}
        pending={isPending}
      >
        {/* <div className="relative flex items-center">
        <HelpCircleIcon className="size-4 text-sky-500 animate-ping absolute" />
        <HelpCircleIcon className="size-4 text-sky-500 absolute" />
      </div>
      <span className="ml-2">How can I improve my answer?</span> */}

        <div className="flex items-center gap-2">
          <div className="grid grid-cols-1 grid-rows-1">
            <HelpCircleIcon className="col-start-1 row-start-1 size-4 text-sky-500 motion-safe:animate-ping" />
            <HelpCircleIcon className="col-start-1 row-start-1 size-4 text-sky-500" />
          </div>
          <p>How can I improve my answer?</p>
        </div>
      </Button>

      {isError ? <Warning>{ErrorFeedback[ErrorType.INTERNAL]}</Warning> : null}

      {isDelayed ? <DelayMessage /> : null}
    </div>
  );
}

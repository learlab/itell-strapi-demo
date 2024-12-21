import { SummaryResponse } from "@itell/core/summary";
import { cn } from "@itell/utils";
import { Lightbulb } from "lucide-react";

import { Accordion, AccordionItem } from "@/components/ui/accordion";

type Props = {
  className?: string;
  response: SummaryResponse;
  needRevision: boolean;
};

export function SummaryResponseFeedback({
  response,
  needRevision,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "my-4 flex flex-col gap-4 font-light leading-relaxed animate-in fade-in",
        className
      )}
      role="alert"
    >
      <header className="space-y-2">
        <p>
          {needRevision
            ? response?.prompt
            : "You have completed all assessments on this page, but you are still welcome to summarize the text."}
        </p>
        {response.is_passed ? (
          <p>
            When revising your summary, please make substantial changes to the
            entire summary. If only small changes are made, you will be asked to
            make additional revisions.
          </p>
        ) : null}
      </header>
      <SummaryFeedbackDetails response={response} />
    </div>
  );
}

export function SummaryFeedbackDetails({
  response,
}: {
  response: SummaryResponse;
}) {
  const terms = Array.from(
    response.suggested_keyphrases ? new Set(response.suggested_keyphrases) : []
  );
  return (
    <div
      className={cn(
        "grid gap-1.5 border-l-4 px-4",
        response.is_passed ? "border-info" : "border-warning"
      )}
      role="status"
    >
      {terms.length > 0 ? (
        <>
          <strong className="mb-2 block text-[1.1em] font-bold">
            Improve your summary by including some of the following keywords
          </strong>{" "}
          <ul className="m-0 space-y-1 p-0">
            {terms.map((term) => (
              <li
                className="flex items-center gap-2 text-accent-foreground"
                key={term}
              >
                <Lightbulb className="size-4" aria-hidden="true" />
                {term}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {response.metrics ? (
        <Accordion value="first">
          <AccordionItem
            value="first"
            title="Scoring details"
            accordionTriggerClassName="text-sm my-2 underline-none"
          >
            {Object.entries(response.metrics).map(
              ([, metric]) =>
                metric.feedback && (
                  <p key={metric.name} className="space-x-1">
                    <span>{metric.is_passed ? "✅" : "❌"}</span>
                    <span className="font-semibold">{metric.name}:</span>
                    <span>{metric.feedback}</span>
                  </p>
                )
            )}
          </AccordionItem>
        </Accordion>
      ) : null}
    </div>
  );
}

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { SummaryFeedback as SummaryFeedbackType } from "@itell/core/summary";
import { cn } from "@itell/utils";
import { Lightbulb } from "lucide-react";

type Props = {
  className?: string;
  feedback: SummaryFeedbackType | null;
  needRevision: boolean;
};

export const SummaryFeedback = ({
  feedback,
  needRevision,
  className,
}: Props) => {
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
            ? feedback?.prompt
            : "You have completed all assessments on this page, but you are still welcome to summarize the text."}
        </p>
        {feedback && !feedback.isPassed && (
          <p>
            When revising your summary, please make substantial changes to the
            entire summary. If only small changes are made, you will be asked to
            make additional revisions.
          </p>
        )}
      </header>
      {feedback && <SummaryFeedbackDetails feedback={feedback} />}
    </div>
  );
};

export const SummaryFeedbackDetails = ({
  feedback,
}: {
  feedback: SummaryFeedbackType;
}) => {
  const terms = feedback?.suggestedKeyphrases
    ? Array.from(new Set(feedback.suggestedKeyphrases))
    : [];
  return (
    <div
      className={cn("grid gap-1.5 border-l-4 px-4", {
        "border-info": feedback.isPassed,
        "border-warning": !feedback.isPassed,
      })}
      role="status"
    >
      <strong className="mb-2 block text-[1.1em] font-bold">
        Improve your summary by including some of the following keywords
      </strong>
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
      {feedback.promptDetails && (
        <Accordion value="first">
          <AccordionItem
            value="first"
            title="Scoring details"
            accordionTriggerClassName="text-sm my-2 underline-none"
          >
            {feedback.promptDetails.map(
              (detail) =>
                // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                detail.feedback.prompt && (
                  <p key={detail.type} className="space-x-1">
                    <span>{detail.feedback.is_passed ? "✅" : "❌"}</span>
                    <span className="font-semibold">{detail.type}:</span>
                    <span>{detail.feedback.prompt}</span>
                  </p>
                )
            )}
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

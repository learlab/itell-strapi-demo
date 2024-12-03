"use client";

import { useEffect, useState } from "react";
import { Elements } from "@itell/constants";
import { useDebounce } from "@itell/core/hooks";
import { levenshteinDistance } from "@itell/core/summary";
import { Label } from "@itell/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@itell/ui/tooltip";
import { cn, numOfWords } from "@itell/utils";
import { InfoIcon } from "lucide-react";
import pluralize from "pluralize";
import { toast } from "sonner";

import { isAdmin } from "@/lib/auth/role";
import { isProduction } from "@/lib/constants";
import { type StageItem } from "@/lib/hooks/use-summary-stage";
import { useSafeSearchParams } from "@/lib/navigation";
import { makeInputKey } from "@/lib/utils";
import { SummaryProgress } from "./summary-progress";
import type { RefObject } from "react";

export const saveSummaryLocal = (pageSlug: string, text: string) => {
  localStorage.setItem(makeInputKey(pageSlug), text);
};

export const getSummaryLocal = (pageSlug: string) => {
  return localStorage.getItem(makeInputKey(pageSlug));
};

export const clearSummaryLocal = (pageSlug: string) => {
  localStorage.removeItem(makeInputKey(pageSlug));
};

type Props = {
  pageSlug: string;
  stages: StageItem[];
  pending: boolean;
  userRole: string;
  prevInput?: string;
  enableSimilarity?: boolean;
  value?: string;
  disabled?: boolean;
  ref: RefObject<HTMLElement | null>;
};

export const SummaryInput = ({
  pageSlug,
  stages,
  disabled = true,
  value = "",
  pending,
  userRole,
  enableSimilarity = false,
  prevInput,
  ref,
}: Props) => {
  const { summary } = useSafeSearchParams("textbook");
  const text = summary
    ? Buffer.from(summary, "base64").toString("ascii")
    : value;
  const [input, setInput] = useState(text);
  const debounced = useDebounce(input, 500);

  const distance =
    enableSimilarity && prevInput
      ? levenshteinDistance(debounced, prevInput)
      : undefined;

  useEffect(() => {
    if (!summary) {
      setInput(getSummaryLocal(pageSlug) ?? value);
    }
  }, [pageSlug, summary, value]);

  return (
    <div className="relative">
      {distance !== undefined ? <Distance distance={distance} /> : null}
      <p
        aria-hidden="true"
        className="z-1 absolute bottom-2 right-2 text-sm font-light opacity-70"
      >
        {pluralize("word", numOfWords(input), true)}
      </p>

      <Label>
        <span className="sr-only">your summary</span>
        <textarea
          spellCheck
          id={Elements.SUMMARY_INPUT}
          name="input"
          ref={ref as RefObject<HTMLTextAreaElement>}
          value={input}
          disabled={disabled}
          placeholder="Write your summary here"
          onChange={(e) => {
            setInput(e.currentTarget.value);
          }}
          rows={10}
          onPaste={(e) => {
            if (isProduction && !isAdmin(userRole)) {
              e.preventDefault();
              toast.warning("Copy & Paste is not allowed");
            }
          }}
          className={cn(
            "flex min-h-[80px] w-full resize-none rounded-md border border-input bg-transparent p-4 px-3 py-2 text-sm font-normal shadow-md ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:text-lg",
            ""
          )}
        />
      </Label>

      {pending ? (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 cursor-not-allowed gap-2 bg-background/80 backdrop-blur-sm transition-all duration-100 animate-in animate-out">
          <SummaryProgress items={stages} />
        </div>
      ) : (
        disabled && (
          <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex cursor-not-allowed items-center justify-center gap-2 bg-background/80 backdrop-blur-sm transition-all duration-100 animate-in animate-out">
            Please finish the entire page first
          </div>
        )
      )}
    </div>
  );
};
const distanceThreshold = 60;

function Distance({ distance }: { distance: number }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-accent">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ease-out ${
            distance >= distanceThreshold ? "bg-info" : "bg-warning"
          }`}
          style={{ width: `${String(distance)}%` }}
        />
        <div
          className="absolute bottom-0 top-0 w-[4px] bg-info"
          style={{ left: `${String(distanceThreshold)}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <span className="z-10 text-sm font-medium">Uniqueness</span>
          <span className="z-10 text-sm font-medium">
            {Math.min(distance, 100).toFixed(1)}%
          </span>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="size-6 flex-shrink-0" />
          </TooltipTrigger>
          <TooltipContent className="w-64">
            Revise your summary to make it more unique to your previous summary
            (pass the threshold indicated by the blue bar).
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

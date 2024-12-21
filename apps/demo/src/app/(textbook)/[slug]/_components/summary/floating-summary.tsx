"use client";

import { useEffect, useState } from "react";
import { Elements } from "@itell/constants";
import { useLocalStorage } from "@itell/core/hooks";
import { Label } from "@itell/ui/label";
import { TextArea } from "@itell/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@itell/ui/tooltip";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { ArrowDownIcon, PinIcon, Store, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  useQuestionStore,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { PageStatus } from "@/lib/page-status";
import { SelectSummaryReady } from "@/lib/store/question-store";
import {
  SelectInput,
  SelectShowFloatingSummary,
} from "@/lib/store/summary-store";
import { scrollToElement } from "@/lib/utils";

export function ToggleShowFloatingSummary() {
  const summaryStore = useSummaryStore();
  const userShow = useSelector(summaryStore, SelectShowFloatingSummary);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label="Toggle show floating summary"
            onClick={() =>
              summaryStore.send({ type: "toggleShowFloatingSummary" })
            }
          >
            <PinIcon
              className={cn("size-4 rotate-45 transition-all", {
                "rotate-0": !userShow,
              })}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {userShow
            ? "Hide floating summary"
            : "Show a floating summary input when you scrolls up"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function FloatingSummary() {
  const summaryStore = useSummaryStore();
  const questionStore = useQuestionStore();
  const isSummaryReady = useSelector(questionStore, SelectSummaryReady);
  const input = useSelector(summaryStore, SelectInput);
  const [assignmentsVisible, setAssignmentsVisible] = useState(false);
  const userShow = useSelector(summaryStore, SelectShowFloatingSummary);
  const show = isSummaryReady && !assignmentsVisible && userShow;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setAssignmentsVisible(true);
      } else {
        setAssignmentsVisible(false);
      }
    });

    const el = document.getElementById("page-assignments");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [setAssignmentsVisible]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-12 left-1/3 z-30 w-2/5 rounded-md border"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
        >
          <header className="flex items-center justify-between px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <p>Your summary</p>
            <div className="flex gap-2">
              <button
                aria-label="Close floating summary"
                onClick={() =>
                  summaryStore.send({ type: "toggleShowFloatingSummary" })
                }
              >
                <XIcon className="size-4" />
              </button>
              <button
                aria-label="Jump to summary submission"
                onClick={() => {
                  scrollToElement(
                    document.getElementById(Elements.PAGE_ASSIGNMENTS)!
                  );
                }}
              >
                <ArrowDownIcon className="size-4" />
              </button>
            </div>
          </header>
          <form className="bg-card px-4 py-2">
            <Label className="flex flex-col gap-3">
              <span className="sr-only">Your summary</span>
              <TextArea
                value={input}
                rows={8}
                placeholder="Write your summary here"
                className="font-normal lg:text-lg"
                onChange={(e) =>
                  summaryStore.send({ type: "setInput", input: e.target.value })
                }
              />
            </Label>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

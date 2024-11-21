"use client";

import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@itell/core/hooks";
import { ErrorFeedback, ErrorType } from "@itell/core/summary";
import { Warning } from "@itell/ui/callout";
import { StatusButton } from "@itell/ui/status-button";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { ArrowRightIcon, CheckSquare2Icon, StepForward } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { incrementUserPageSlugAction } from "@/actions/user";
import { DelayMessage } from "@/components/delay-message";
import {
  useQuestionStore,
  useQuizStore,
} from "@/components/provider/page-provider";
import { Confetti } from "@/components/ui/confetti";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage, PageData } from "@/lib/pages";
import { SelectSummaryReady } from "@/lib/store/question-store";
import { reportSentry } from "@/lib/utils";
import type { FormEvent } from "react";

type Props = {
  pageStatus: PageStatus;
  page: PageData;
  streak: number;
};

export const SummaryFormSkip = memo(({ pageStatus, page, streak }: Props) => {
  const questionStore = useQuestionStore();
  const quizStore = useQuizStore();
  const isSummaryReady = useSelector(questionStore, SelectSummaryReady);
  const router = useRouter();
  const [finished, setFinished] = useState(pageStatus.unlocked);
  const duration = Math.max(1000 - streak * 100, 200);

  const {
    action,
    isError,
    isPending: _isPending,
    error,
    isDelayed,
  } = useActionStatus(
    async (e: FormEvent) => {
      e.preventDefault();

      if (page.quiz && page.quiz.length > 0 && !pageStatus.unlocked) {
        quizStore.send({
          type: "toggleQuiz",
        });
        return;
      }

      if (isLastPage(page)) {
        toast.info("You have finished the entire textbook!", {
          important: true,
          duration: 100000,
        });
      }

      if (!finished && page.next_slug) {
        console.log("Incrementing user page slug");
        const [_, err] = await incrementUserPageSlugAction({
          currentPageSlug: page.slug,
          withStreakSkip: true,
        });
        if (err) {
          throw new Error("increment user page slug action", { cause: err });
        }
        setFinished(true);
        router.push(page.next_slug);
        return;
      }

      if (finished && page.next_slug) {
        router.push(page.next_slug);
        return;
      }
    },
    { delayTimeout: 3000 }
  );
  const isPending = useDebounce(_isPending, 100);

  useEffect(() => {
    if (isError) {
      reportSentry("summary skip", {
        pageSlug: page.slug,
        error: error?.cause,
      });
    }
  }, [isError]);

  if (!isSummaryReady) {
    return (
      <div className="mx-auto max-w-2xl">
        <p>Finish the entire page to move on.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Confetti active={finished} />
      <div className="mb-1.5 text-2xl font-extrabold">
        Nicely Done!
        <hr />
      </div>
      <div className="mb-4 text-base" role="status">
        {finished ? (
          "You are currently on a streak of writing good summaries! You can skip writing a summary on a page you haven't completed yet."
        ) : (
          <>
            <div>
              You are currently on{" "}
              <span className="font-bold underline decoration-sky-500 decoration-solid decoration-2">
                {" "}
                a streak of writing good summaries!{" "}
              </span>{" "}
              <br />
              You have earned the right to skip writing a summary for this page.{" "}
              <br />
            </div>
            <div className="flex">
              <span
                className={cn(
                  "ease motion-safe:animate-spin",
                  `duration-${duration}`
                )}
              >
                ⭐
              </span>{" "}
              Streak count: <span className="text-rose-700">{streak}</span>{" "}
            </div>
          </>
        )}
      </div>

      <h2 id="completion-form-heading" className="sr-only">
        completion
      </h2>
      <form
        aria-labelledby="completion-form-heading"
        className="flex justify-end gap-2"
        onSubmit={action}
      >
        <StatusButton
          pending={isPending}
          disabled={finished ? !page.next_slug : false}
          className="w-44"
        >
          {!finished ? (
            <span className="inline-flex items-center gap-1">
              <StepForward className="size-4" /> Skip Summary
            </span>
          ) : page.next_slug ? (
            <span className="inline-flex items-center gap-1">
              <ArrowRightIcon className="size-4" /> Go to next page
            </span>
          ) : (
            <span>Textbook finished</span>
          )}
        </StatusButton>
      </form>
      {isError ? (
        <Warning role="alert">{ErrorFeedback[ErrorType.INTERNAL]}</Warning>
      ) : null}
      {isDelayed ? <DelayMessage /> : null}
    </div>
  );
});

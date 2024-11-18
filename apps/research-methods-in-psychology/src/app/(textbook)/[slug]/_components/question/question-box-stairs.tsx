"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "@itell/core/hooks";
import { Button } from "@itell/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@itell/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itell/ui/hover-card";
import { Label } from "@itell/ui/label";
import { StatusButton } from "@itell/ui/status-button";
import { TextArea } from "@itell/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@itell/ui/tooltip";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { Flame, KeyRoundIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import { useServerAction } from "zsa-react";

import {
  createQuestionAnswerAction,
  getUserQuestionStreakAction,
} from "@/actions/question";
import { useQuestionStore } from "@/components/provider/page-provider";
import { Confetti } from "@/components/ui/confetti";
import { apiClient } from "@/lib/api-client";
import { Condition, isProduction } from "@/lib/constants";
import { SelectShouldBlur } from "@/lib/store/question-store";
import { insertNewline, reportSentry } from "@/lib/utils";
import { ExplainButton } from "./explain-button";
import { FinishQuestionButton } from "./finish-question-button";
import { QuestionFeedback } from "./question-feedback";
import { borderColors, StatusStairs } from "./types";
import type { QuestionScore } from "./types";

type Props = {
  question: string;
  answer: string;
  chunkSlug: string;
  pageSlug: string;
};

type State = {
  status: StatusStairs;
  error: string | null;
  input: string;
};

export function QuestionBoxStairs({
  question,
  answer,
  chunkSlug,
  pageSlug,
}: Props) {
  const store = useQuestionStore();
  const shouldBlur = useSelector(store, SelectShouldBlur);
  const form = useRef<HTMLFormElement>(null);

  const {
    data: streak,
    setOptimistic: setOptimisticStreak,
    execute: getStreak,
  } = useServerAction(getUserQuestionStreakAction);
  const [collapsed, setCollapsed] = useState(!shouldBlur);
  const [state, setState] = useState<State>({
    status: StatusStairs.UNANSWERED,
    error: null,
    input: "",
  });

  const {
    action: onSubmit,
    isPending: _isPending,
    isError,
    error,
  } = useActionStatus(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = String(formData.get("input")).trim();
    if (input.length === 0) {
      setState((state) => ({ ...state, error: "Answer cannot be empty" }));
      return;
    }

    if (input === state.input) {
      setState((state) => ({
        ...state,
        error: "Please submit a different answer",
      }));
      return;
    }

    const res = await apiClient.api.cri.$post({
      json: {
        page_slug: pageSlug,
        chunk_slug: chunkSlug,
        answer: input,
      },
    });
    if (!res.ok) {
      const { details, error } = await res.json();
      throw new Error(error, { cause: details });
    }
    const response = await res.json();
    const score = response.score as QuestionScore;
    createQuestionAnswerAction({
      text: input,
      chunkSlug,
      pageSlug,
      score,
      condition: Condition.STAIRS,
    });

    // if answer is correct, mark chunk as finished
    // this will add the chunk to the list of finished chunks that gets excluded from stairs question
    if (score === 2) {
      store.send({ type: "finishChunk", chunkSlug, passed: true });

      setState({
        status: StatusStairs.BOTH_CORRECT,
        error: null,
        input,
      });
      setOptimisticStreak((streak) => (streak ? streak + 1 : 1));
    }

    if (score === 1) {
      setState({
        status: StatusStairs.SEMI_CORRECT,
        error: null,
        input,
      });
    }

    if (score === 0) {
      setState({
        status: StatusStairs.BOTH_INCORRECT,
        error: null,
        input,
      });
      setOptimisticStreak(0);
    }
  });

  const isPending = useDebounce(_isPending, 100);

  const status = state.status;
  const isNextButtonDisplayed =
    shouldBlur && status !== StatusStairs.UNANSWERED;

  const borderColor = borderColors[state.status];

  useEffect(() => {
    if (isError) {
      setState((state) => ({
        ...state,
        status: StatusStairs.PASSED,
        error: "Failed to evaluate answer, please try again later",
      }));
      reportSentry("evaluate constructed response", { error: error?.cause });
    }
  }, [isError]);

  useEffect(() => {
    getStreak();
  }, []);

  if (collapsed) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          setCollapsed(false);
        }}
      >
        Reveal optional question
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        "zoom-10 flex flex-col items-center justify-center space-y-2 px-6 py-4 animate-in fade-in",
        borderColor,
        { shake: state.status === StatusStairs.BOTH_INCORRECT }
      )}
    >
      <Confetti active={status === StatusStairs.BOTH_CORRECT} />

      <CardHeader className="flex w-full flex-row items-baseline justify-center gap-1 p-2">
        <CardDescription className="mx-auto flex max-w-96 items-center justify-center gap-2 text-xs font-light text-muted-foreground">
          <span>🔍</span>
          <span>
            iTELL evaluation is based on AI and may not always be accurate
          </span>
        </CardDescription>

        {streak !== undefined && streak >= 2 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Flame
                    color="#b91c1c"
                    className={cn("size-4", {
                      "motion-safe:animate-ping": streak >= 7,
                      "motion-safe:animate-pulse": streak >= 5 && streak < 7,
                      "motion-safe:animate-bounce": streak >= 2 && streak < 5,
                    })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  You have answered {streak} questions correctly in a row, good
                  job!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardHeader>

      <CardContent className="mx-auto mt-0.5 flex w-4/5 flex-col items-center justify-center space-y-4">
        <div role="status" className="space-y-4">
          {status === StatusStairs.BOTH_INCORRECT && (
            <div className="text-sm">
              <p className="mt-0.5 text-red-400">
                <b>iTELL AI says:</b> You likely got a part of the answer wrong.
                Please try again.
              </p>
              {/* <p className="underline">
                {isLastQuestion
                  ? 'If you believe iTELL AI has made an error, you can click on the "Unlock summary" button to skip this question and start writing a summary.'
                  : 'If you believe iTELL AI has made an error, you can click on the "Continue reading" button to skip this question.'}
              </p> */}
            </div>
          )}

          {status === StatusStairs.SEMI_CORRECT && (
            <p className="mt-0.5 text-xs text-yellow-600">
              <b>iTELL AI says:</b> You may have missed something, but you were
              generally close.
            </p>
          )}

          {status === StatusStairs.BOTH_CORRECT ? (
            <div className="flex flex-col items-center">
              <p className="text-xl2 mt-0.5 text-center text-emerald-600">
                Your answer is correct!
              </p>
              {/* {shouldBlur ? (
                <p className="text-sm">
                  Click on the button below to continue reading.
                </p>
              ) : null} */}
            </div>
          ) : (
            question && (
              <p className="flex items-baseline gap-2">
                <span className="flex-1">
                  <span className="font-bold">Question </span>
                  {!shouldBlur && <span className="font-bold">(Optional)</span>}
                  : <span>{question}</span>
                </span>
              </p>
            )
          )}
        </div>

        <h3 id="form-question-heading" className="sr-only">
          Answer the question
        </h3>
        <form
          ref={form}
          aria-labelledby="form-question-heading"
          onSubmit={onSubmit}
          className="w-full space-y-2"
        >
          <Label>
            <span className="sr-only">your answer</span>
            <TextArea
              name="input"
              rows={2}
              className="mx-auto max-w-lg rounded-md p-4 shadow-md"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  e.preventDefault();
                  insertNewline(e.currentTarget);
                  return;
                }

                if (e.key === "Enter") {
                  e.preventDefault();
                  form.current?.requestSubmit();
                }
              }}
              onPaste={(e) => {
                if (isProduction) {
                  e.preventDefault();
                  toast.warning("Copy & Paste is not allowed for question");
                }
              }}
            />
          </Label>

          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
            {status !== StatusStairs.UNANSWERED && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" type="button" className="gap-2">
                    <KeyRoundIcon className="size-4" />
                    Reveal Answer
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p className="no-select leading-relaxed">{answer}</p>
                </HoverCardContent>
              </HoverCard>
            )}

            {status === StatusStairs.BOTH_CORRECT && isNextButtonDisplayed ? (
              // when answer is both correct and next button should be displayed
              <FinishQuestionButton
                chunkSlug={chunkSlug}
                pageSlug={pageSlug}
                condition={Condition.STAIRS}
              />
            ) : (
              // when answer is not both correct
              <>
                {status !== StatusStairs.BOTH_CORRECT && (
                  <StatusButton
                    pending={isPending}
                    type="submit"
                    disabled={_isPending}
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      <PencilIcon className="size-4" />
                      Answer
                    </span>
                  </StatusButton>
                )}

                {status !== StatusStairs.UNANSWERED && isNextButtonDisplayed ? (
                  <FinishQuestionButton
                    chunkSlug={chunkSlug}
                    pageSlug={pageSlug}
                    condition={Condition.STAIRS}
                  />
                ) : null}
              </>
            )}
          </div>
          {state.error ? (
            <p className="text-center text-sm text-red-500">{state.error}</p>
          ) : null}

          <div className="mt-4 flex items-center justify-center">
            {(status === StatusStairs.SEMI_CORRECT ||
              status === StatusStairs.BOTH_INCORRECT) && (
              <span className="mx-2 flex items-center gap-2">
                <ExplainButton
                  chunkSlug={chunkSlug}
                  pageSlug={pageSlug}
                  input={state.input}
                />
              </span>
            )}
          </div>

          {status !== StatusStairs.UNANSWERED && isNextButtonDisplayed ? (
            <div className="mx-auto flex max-w-80 items-center justify-around">
              <div className="flex items-center justify-center text-xs font-light text-muted-foreground">
                What did you think about the feedback?
              </div>
              <div className="space-x-2">
                <QuestionFeedback
                  type="positive"
                  pageSlug={pageSlug}
                  chunkSlug={chunkSlug}
                />
                <QuestionFeedback
                  type="negative"
                  pageSlug={pageSlug}
                  chunkSlug={chunkSlug}
                />
              </div>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "@itell/core/hooks";
import { Button } from "@itell/ui/button";
import { CardDescription, CardFooter } from "@itell/ui/card";
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
import {
  Flame,
  FlaskConicalIcon,
  KeyRoundIcon,
  PencilIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import { useServerAction } from "zsa-react";

import {
  createQuestionAnswerAction,
  createUserQuestionStreakAction,
  getUserQuestionStreakAction,
} from "@/actions/question";
import { useQuestionStore } from "@/components/provider/page-provider";
import { Confetti } from "@/components/ui/confetti";
import { apiClient } from "@/lib/api-client";
// import { apiClient } from "@/lib/api-client";
import { Condition, isProduction } from "@/lib/constants";
import { SelectShouldBlur } from "@/lib/store/question-store";
import { insertNewline, reportSentry } from "@/lib/utils";
import { FinishQuestionButton } from "./finish-question-button";
import {
  QuestionBoxContent,
  QuestionBoxHeader,
  QuestionBoxShell,
} from "./question-box-shell";
import { QuestionExplainButton } from "./question-explain-button";
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
    execute,
    setOptimistic: setStreak,
  } = useServerAction(getUserQuestionStreakAction);

  useEffect(() => {
    execute();
  }, []);

  const { execute: updateStreak } = useServerAction(
    createUserQuestionStreakAction
  );
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
      setStreak((streak) => (streak ? streak + 1 : 1));
      updateStreak({ isCorrect: true });
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
      setStreak(0);
      updateStreak({ isCorrect: false });
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

  if (collapsed) {
    return (
      <QuestionBoxShell>
        <QuestionBoxContent>
          <p className="my-2">
            You can skip the following question or click to reveal.
          </p>
          <div>
            <Button
              variant="outline"
              onClick={() => {
                setCollapsed(false);
              }}
            >
              Reveal optional question
            </Button>
          </div>
        </QuestionBoxContent>
      </QuestionBoxShell>
    );
  }

  function streakToSize(streakCount: number) {
    return 4 + (7 * streakCount) / (8 + streakCount);
  }

  function toClassName(streakCount: number) {
    let classString = `size-[${streakToSize(streakCount).toString()}]`;
    if (streakCount < 2) {
      return "";
    } else if (streakCount < 5) {
      return `${classString} motion-safe:animate-bounce`;
    } else if (streakCount < 7) {
      return `${classString} motion-safe:animate-pulse`;
    }
    return `${classString} motion-safe:animate-ping`;
  }

  return (
    <QuestionBoxShell
      className={cn(borderColor, {
        shake: state.status === StatusStairs.BOTH_INCORRECT,
      })}
    >
      <Confetti active={status === StatusStairs.BOTH_CORRECT} />

      <QuestionBoxHeader isOptional={!shouldBlur} question={question}>
        {streak !== undefined && streak >= 2 ? (
          <CardDescription>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Flame color="#b91c1c" className={toClassName(streak)} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    You have answered {streak} questions correctly in a row,
                    good job!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardDescription>
        ) : null}
      </QuestionBoxHeader>

      <QuestionBoxContent>
        <div role="status">
          {status === StatusStairs.BOTH_INCORRECT && (
            <p className="text-sm text-destructive-foreground">
              <b>iTELL AI says:</b> You likely got a part of the answer wrong.
              Please try again.
            </p>
          )}

          {status === StatusStairs.SEMI_CORRECT && (
            <p className="text-sm text-warning">
              <b>iTELL AI says:</b> You may have missed something, but you were
              generally close.
            </p>
          )}

          {status === StatusStairs.BOTH_CORRECT ? (
            <p className="text-center text-xl text-emerald-600">
              Your answer is correct!
            </p>
          ) : null}
        </div>

        <h3 id="form-question-heading" className="sr-only">
          Answer the question
        </h3>

        <div className="flex items-center gap-2">
          {(status === StatusStairs.SEMI_CORRECT ||
            status === StatusStairs.BOTH_INCORRECT) && (
            <QuestionExplainButton
              chunkSlug={chunkSlug}
              pageSlug={pageSlug}
              input={state.input}
            />
          )}
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
        </div>

        <form
          ref={form}
          aria-labelledby="form-question-heading"
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
        >
          <Label className="font-normal">
            <span className="sr-only">your answer</span>
            <TextArea
              name="input"
              rows={3}
              className="rounded-md p-4 shadow-md lg:text-lg"
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

          <div className="flex flex-col items-center gap-2 sm:flex-row">
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
                    className="min-w-40"
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
        </form>
      </QuestionBoxContent>

      <CardFooter>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FlaskConicalIcon className="size-4" />
          <p>
            iTELL evaluation is based on AI and may not always be accurate.
            Provide feedback
          </p>
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
      </CardFooter>
    </QuestionBoxShell>
  );
}

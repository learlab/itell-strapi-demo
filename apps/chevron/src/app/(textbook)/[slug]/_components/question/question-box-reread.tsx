"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "@itell/core/hooks";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { StatusButton } from "@itell/ui/status-button";
import { TextArea } from "@itell/ui/textarea";
import { useSelector } from "@xstate/store/react";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { createQuestionAnswerAction } from "@/actions/question";
import { InternalError } from "@/components/internal-error";
import { useQuestionStore } from "@/components/provider/page-provider";
import { apiClient } from "@/lib/api-client";
import { Condition, isProduction } from "@/lib/constants";
import { SelectShouldBlur } from "@/lib/store/question-store";
import { insertNewline, reportSentry } from "@/lib/utils";
import { FinishQuestionButton } from "./finish-question-button";
import {
  QuestionBoxContent,
  QuestionBoxHeader,
  QuestionBoxShell,
} from "./question-box-shell";
import { StatusReread } from "./types";
import type { QuestionScore } from "./types";

type Props = {
  question: string;
  answer: string;
  chunkSlug: string;
  pageSlug: string;
};

type State = {
  status: StatusReread;
  show: boolean;
  error: string | null;
};

export function QuestionBoxReread({ question, chunkSlug, pageSlug }: Props) {
  const store = useQuestionStore();
  const shouldBlur = useSelector(store, SelectShouldBlur);
  const form = useRef<HTMLFormElement>(null);

  const [state, setState] = useState<State>({
    error: null,
    status: StatusReread.UNANSWERED,
    show: shouldBlur,
  });

  const {
    action: onSubmit,
    isPending: _isPending,
    isError,
    error,
  } = useActionStatus(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, error: null }));
    const formData = new FormData(e.currentTarget);
    const input = String(formData.get("input")).trim();
    if (input.length === 0) {
      setState((state) => ({ ...state, error: "Answer cannot be empty" }));
      return;
    }

    const response = await apiClient.api.cri.$post({
      json: {
        answer: input,
        chunk_slug: chunkSlug,
        page_slug: pageSlug,
      },
    });
    if (!response.ok) {
      const { error, details } = await response.json();
      throw new Error(error, { cause: details });
    }

    const data = await response.json();
    const score = data.score as QuestionScore;

    store.send({ type: "finishChunk", chunkSlug, passed: false });

    setState((state) => ({
      ...state,
      error: null,
      status: StatusReread.ANSWERED,
    }));

    createQuestionAnswerAction({
      text: input,
      condition: Condition.RANDOM_REREAD,
      chunkSlug,
      pageSlug,
      score,
    });
  });
  const isPending = useDebounce(_isPending, 100);

  const isNextButtonDisplayed =
    shouldBlur && state.status === StatusReread.ANSWERED;

  useEffect(() => {
    if (isError) {
      setState((state) => ({
        ...state,
        error: "Failed to evaluate answer, please try again later",
      }));
      reportSentry("evaluate constructed response", { error: error?.cause });
    }
  }, [isError]);

  if (!state.show) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          setState((state) => ({ ...state, show: true }));
        }}
      >
        Reveal optional question
      </Button>
    );
  }

  return (
    <QuestionBoxShell className="border-info">
      <QuestionBoxHeader isOptional={!shouldBlur} question={question} />
      <QuestionBoxContent>
        <div role="status">
          {state.status === StatusReread.ANSWERED && (
            <p className="text-sm text-muted-foreground">
              Thanks for completing this question. You can move on to the next
              section or refine your answer.
            </p>
          )}
        </div>

        <h2 id="form-question-heading" className="sr-only">
          Answer the question
        </h2>
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
              onPaste={(e) => {
                if (isProduction) {
                  e.preventDefault();
                  toast.warning("Copy & Paste is not allowed for question");
                }
              }}
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
            />
          </Label>

          {state.error ? (
            <InternalError>
              <p>{state.error}</p>
            </InternalError>
          ) : null}

          <div className="flex flex-col items-center gap-2 sm:flex-row">
            {state.status === StatusReread.UNANSWERED ? (
              <StatusButton
                pending={isPending}
                type="submit"
                disabled={_isPending}
                variant="outline"
                className="w-40"
              >
                <span className="flex items-center gap-2">
                  <PencilIcon className="size-4" />
                  Answer
                </span>
              </StatusButton>
            ) : null}

            {state.status !== StatusReread.UNANSWERED &&
            isNextButtonDisplayed ? (
              <FinishQuestionButton
                pageSlug={pageSlug}
                chunkSlug={chunkSlug}
                condition={Condition.RANDOM_REREAD}
              />
            ) : null}
          </div>
        </form>
      </QuestionBoxContent>
    </QuestionBoxShell>
  );
}

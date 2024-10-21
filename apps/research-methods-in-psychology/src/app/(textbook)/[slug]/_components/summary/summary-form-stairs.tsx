"use client";

import { Elements } from "@itell/constants";
import {
  useDebounce,
  useIsMobile,
  useKeystroke,
  usePortal,
  useTimer,
} from "@itell/core/hooks";
import { PortalContainer } from "@itell/core/portal-container";
import {
  ErrorFeedback,
  ErrorType,
  SummaryResponseSchema,
  validateSummary,
} from "@itell/core/summary";
import { driver, removeInert, setInertBackground } from "@itell/driver.js";

import { createEventAction } from "@/actions/event";
import { getFocusTimeAction } from "@/actions/focus-time";
import { createSummaryAction } from "@/actions/summary";
import { DelayMessage } from "@/components/delay-message";
import {
  useChatStore,
  useQuestionStore,
  useQuizStore,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { Callout } from "@/components/ui/callout";
import { apiClient } from "@/lib/api-client";
import { Condition } from "@/lib/constants";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages/pages.client";
import { getHistory, SelectStairsAnswered } from "@/lib/store/chat-store";
import {
  getExcludedChunks,
  SelectSummaryReady,
} from "@/lib/store/question-store";
import {
  SelectError,
  SelectIsNextPageVisible,
  SelectPrevInput,
  SelectResponse,
  SelectStairs,
} from "@/lib/store/summary-store";
import { makePageHref, reportSentry, scrollToElement } from "@/lib/utils";
import type { PageData } from "@/lib/pages/pages.client";
import type { StairsQuestion } from "@/lib/store/summary-store";
import type {
  SummaryFeedback as SummaryFeedbackType,
  SummaryResponse,
} from "@itell/core/summary";

import "@itell/driver.js/dist/driver.css";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@itell/ui/button";
import { getChunkElement } from "@itell/utils";
import { type User } from "lucia";
import { FileQuestionIcon, SendHorizontalIcon } from "lucide-react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { ChatStairs } from "@textbook/chat-stairs";
import { useSelector } from "@xstate/store/react";
import { SummaryFeedback, SummaryFeedbackDetails } from "./summary-feedback";
import {
  getSummaryLocal,
  saveSummaryLocal,
  SummaryInput,
} from "./summary-input";
import { NextPageButton } from "./summary-next-page-button";

interface Props {
  user: User;
  page: PageData;
  pageStatus: PageStatus;
}

export function SummaryFormStairs({ user, page, pageStatus }: Props) {
  const pageSlug = page.slug;
  const isLast = isLastPage(page);
  const { portals, addPortal, removePortals } = usePortal();
  const router = useRouter();
  const { addStage, clearStages, finishStage, stages } = useSummaryStage();

  // for debugging
  const { ref, data: keystrokes, clear: clearKeystroke } = useKeystroke();
  const requestBodyRef = useRef<string | null>(null);
  const summaryResponseRef = useRef<SummaryResponse | null>(null);
  const stairsDataRef = useRef<StairsQuestion | null>(null);
  const stairsAnsweredRef = useRef(false);
  const isMobile = useIsMobile();

  // stores
  const chatStore = useChatStore();
  const questionStore = useQuestionStore();
  const summaryStore = useSummaryStore();
  const quizStore = useQuizStore();

  // states
  const isSummaryReady = useSelector(questionStore, SelectSummaryReady);
  const response = useSelector(summaryStore, SelectResponse);
  const prevInput = useSelector(summaryStore, SelectPrevInput);
  const isNextPageVisible = useSelector(summaryStore, SelectIsNextPageVisible);
  const stairsQuestion = useSelector(summaryStore, SelectStairs);
  const submissionError = useSelector(summaryStore, SelectError);
  const feedback = response ? getFeedback(response) : null;

  const {
    action,
    isPending: _isPending,
    isDelayed,
    error,
  } = useActionStatus(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      clearStages();
      summaryStore.send({ type: "submit" });
      addStage("Scoring");

      const formData = new FormData(e.currentTarget);
      const input = String(formData.get("input")).trim();

      saveSummaryLocal(pageSlug, input);
      const error = validateSummary(input, prevInput);

      if (error) {
        summaryStore.send({ type: "fail", error });
        return;
      }

      const [focusTime, err] = await getFocusTimeAction({ pageSlug });
      if (err) {
        throw new Error("get focus time action", { cause: err });
      }
      const body = {
        summary: input,
        page_slug: pageSlug,
        focus_time: focusTime?.data,
        chat_history: getHistory(chatStore),
        excluded_chunks: getExcludedChunks(questionStore),
      };
      requestBodyRef.current = JSON.stringify(body);
      const response = await apiClient.api.summary.stairs.$post({
        json: body,
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let chunkIndex = 0;
        let stairsChunk: string | null = null;

        while (!done) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const chunk = decoder.decode(value, { stream: true });
          if (chunkIndex === 0) {
            const data = chunk
              .trim()
              .split("\n")
              .at(1)
              ?.replace(/data:\s+/, "");

            console.log("summary response chunk", data);

            const parsed = SummaryResponseSchema.safeParse(
              JSON.parse(String(data))
            );
            if (parsed.success) {
              summaryResponseRef.current = parsed.data;
              summaryStore.send({ type: "scored", response: parsed.data });
              finishStage("Scoring");
            } else {
              clearStages();
              summaryStore.send({ type: "fail", error: ErrorType.INTERNAL });
              // summaryResponse parsing failed, return early
              reportSentry(
                "first chunk of stairs summary response in wrong shape",
                {
                  body,
                  chunk: data,
                }
              );
              return;
            }
          } else {
            if (summaryResponseRef.current?.is_passed) {
              // if the summary passed, we don't need to process later chunks
              // note that if the user pass by summary amount
              // question will still be generated but will not be asked
              // they can still see the "question" button
              break;
            }

            if (chunkIndex === 1) {
              addStage("Analyzing");
            }
            if (chunk) {
              stairsChunk = chunk;
            }
          }

          chunkIndex++;
        }

        if (stairsChunk) {
          // eslint-disable-next-line prefer-named-capture-group
          const regex = /data: ({"request_id":.*?})\n*/;
          const match = regex.exec(stairsChunk.trim());
          console.log("final stairs chunk\n", stairsChunk);
          if (match?.[1]) {
            const stairsString = match[1];
            console.log("parsed as", stairsString);
            const stairsData = JSON.parse(stairsString) as StairsQuestion;
            stairsDataRef.current = stairsData;
            finishStage("Analyzing");
            chatStore.send({ type: "setStairsQuestion", data: stairsData });
          } else {
            throw new Error("invalid stairs chunk", { cause: stairsChunk });
          }
        }
      } else {
        throw new Error("fetch score summary stairs", {
          cause: await response.text(),
        });
      }

      if (summaryResponseRef.current) {
        const scores = summaryResponseRef.current;
        addStage("Saving");

        const [data, err] = await createSummaryAction({
          summary: {
            text: input,
            pageSlug,
            condition: Condition.STAIRS,
            isPassed: scores.is_passed ?? false,
            containmentScore: scores.containment,
            similarityScore: scores.similarity,
            languageScore: scores.language,
            contentScore: scores.content,
          },
          keystroke: {
            start: prevInput ?? getSummaryLocal(pageSlug) ?? "",
            data: keystrokes,
            isMobile: isMobile ?? false,
          },
        });
        if (err) {
          throw new Error("create summary action", { cause: err });
        }

        clearKeystroke();
        finishStage("Saving");

        if (data.canProceed) {
          if (page.quiz && page.quiz.length > 0 && !pageStatus.unlocked) {
            quizStore.send({
              type: "toggleQuiz",
            });
            return;
          }
        }

        summaryStore.send({
          type: "finishPage",
          isNextPageVisible: data.canProceed ? !isLast : undefined,
          input,
        });

        if (stairsDataRef.current) {
          summaryStore.send({
            type: "stairs",
            data: stairsDataRef.current,
          });

          if (!data.canProceed && !pageStatus.unlocked) {
            goToQuestion(stairsDataRef.current);
          }
        }
      }
    },
    { delayTimeout: 20000 }
  );
  const isPending = useDebounce(_isPending, 100);

  useEffect(() => {
    if (summaryResponseRef.current) {
      if (isLast) {
        toast.info("You have finished the entire textbook!");
      } else {
        const title = feedback?.isPassed
          ? "Good job summarizing 🎉"
          : "You can now move on 👏";
        toast(title, {
          className: "toast",
          description: "Move to the next page to continue reading",
          duration: 5000,
          action: page.next_slug
            ? {
                label: "Proceed",
                onClick: () => {
                  router.push(makePageHref(page.next_slug));
                },
              }
            : undefined,
        });
      }
    }
  }, [isNextPageVisible]);

  useEffect(() => {
    driverObj.setConfig({
      smoothScroll: false,
      animate: false,
      allowClose: false,
      onPopoverRender: (popover) => {
        addPortal(
          <ChatStairs
            id={Elements.STAIRS_CONTAINER}
            pageSlug={pageSlug}
            footer={
              <FinishReadingButton
                onClick={(time) => {
                  if (!stairsAnsweredRef.current) {
                    stairsAnsweredRef.current = true;
                    createEventAction({
                      type: Condition.STAIRS,
                      pageSlug,
                      data: {
                        stairs: stairsDataRef.current,
                        time,
                      },
                    });
                  }
                  exitQuestion();
                }}
              />
            }
          />,
          popover.wrapper
        );

        setTimeout(() => {
          document.getElementById(Elements.STAIRS_CONTAINER)?.focus();
        }, 100);
      },
      onHighlightStarted: (element) => {
        if (element) {
          element.setAttribute("tabIndex", "0");
          element.setAttribute("id", Elements.STAIRS_HIGHLIGHTED_CHUNK);

          const link = document.createElement("a");
          link.href = `#${Elements.STAIRS_READY_BUTTON}`;
          link.textContent = "answer the question";
          link.className = "sr-only";
          link.id = Elements.STAIRS_ANSWER_LINK;
          element.insertAdjacentElement("afterend", link);
        }
      },
      onHighlighted: () => {
        if (stairsDataRef.current?.chunk) {
          setInertBackground(stairsDataRef.current.chunk);
        }

        const chunk = document.getElementById(
          Elements.STAIRS_HIGHLIGHTED_CHUNK
        );
        if (summaryResponseRef.current && chunk) {
          const node = document.createElement("div");
          node.id = Elements.STAIRS_FEEDBACK_CONTAINER;

          addPortal(
            <SummaryFeedbackDetails
              feedback={getFeedback(summaryResponseRef.current)}
            />,
            node
          );
          chunk.prepend(node);
        }
      },
      onDestroyed: (element) => {
        removeInert();
        removePortals();
        document.getElementById(Elements.STAIRS_FEEDBACK_CONTAINER)?.remove();

        if (element) {
          element.removeAttribute("tabIndex");
          element.removeAttribute("id");
          document.getElementById(Elements.STAIRS_ANSWER_LINK)?.remove();
        }

        const assignments = document.getElementById(Elements.PAGE_ASSIGNMENTS);
        if (assignments) {
          setTimeout(() => {
            scrollToElement(assignments);
          }, 100);
        }

        document.getElementById(Elements.SUMMARY_INPUT)?.focus();
      },
    });
  }, []);

  useEffect(() => {
    if (error) {
      summaryStore.send({ type: "fail", error: ErrorType.INTERNAL });
      clearStages();
      reportSentry("score summary stairs", {
        body: requestBodyRef.current,
        summaryResponse: summaryResponseRef.current,
        stairsData: stairsDataRef.current,
        error: error.cause,
      });
    }
  }, [error]);

  return (
    <>
      <PortalContainer portals={portals} />
      <div className="flex flex-col gap-2" id={Elements.SUMMARY_FORM}>
        {feedback ? (
          <SummaryFeedback
            className={isPending ? "opacity-70" : ""}
            feedback={feedback}
            needRevision={isLast ? !user.finished : !isNextPageVisible}
          />
        ) : null}

        <div className="flex items-center gap-2">
          {isNextPageVisible && page.next_slug ? (
            <NextPageButton pageSlug={page.next_slug} />
          ) : null}
          {stairsQuestion ? (
            <Button
              variant="outline"
              onClick={() => {
                goToQuestion(stairsQuestion);
              }}
            >
              <span className="flex items-center gap-2">
                <FileQuestionIcon className="size-4" />
                Reflection
              </span>
            </Button>
          ) : null}
        </div>
        <Confetti active={feedback?.isPassed ?? false} />
        <h2 id="summary-form-heading" className="sr-only">
          submit summary
        </h2>
        <form
          className="mt-2 space-y-4"
          onSubmit={action}
          aria-labelledby="summary-form-heading"
        >
          {submissionError ? (
            <Callout variant="warning" title="Error">
              {ErrorFeedback[submissionError]}
            </Callout>
          ) : null}
          {isDelayed ? <DelayMessage /> : null}

          <SummaryInput
            disabled={!isSummaryReady}
            pageSlug={pageSlug}
            pending={isPending}
            stages={stages}
            userRole={user.role}
            enableSimilarity
            prevInput={prevInput}
            ref={ref}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || !isSummaryReady}
              pending={isPending}
            >
              <span className="inline-flex items-center gap-2">
                <SendHorizontalIcon className="size-3" />
                Submit
              </span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

function FinishReadingButton({ onClick }: { onClick: (_: number) => void }) {
  const store = useChatStore();
  const stairsAnswered = useSelector(store, SelectStairsAnswered);
  const { time, clearTimer } = useTimer();

  return (
    <div className="mt-4 flex justify-end">
      <Button
        size="sm"
        disabled={!stairsAnswered}
        id={Elements.STAIRS_RETURN_BUTTON}
        onClick={() => {
          onClick(time);
          clearTimer();
        }}
      >
        Return to summary
      </Button>
    </div>
  );
}

const getFeedback = (response: SummaryResponse): SummaryFeedbackType => {
  return {
    isPassed: response.is_passed ?? false,
    prompt: response.prompt ?? "",
    promptDetails: response.prompt_details ?? [],
    suggestedKeyphrases: response.suggested_keyphrases,
  };
};
const driverObj = driver();

const exitQuestion = () => {
  driverObj.destroy();
};

const goToQuestion = (question: StairsQuestion) => {
  const el = getChunkElement(question.chunk, "data-chunk-slug");
  if (el) {
    driverObj.highlight({
      element: el,
      popover: {
        description: "",
      },
    });
    setTimeout(() => {
      scrollToElement(el);
    }, 100);
  } else {
    toast.warning(
      "Please revise your summary with substantial changes and resubmit to unlock the next page"
    );
  }
};

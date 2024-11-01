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
} from "@itell/core/summary";
import { driver, removeInert, setInertBackground } from "@itell/driver.js";

import { createEventAction } from "@/actions/event";
import { createSummaryAction } from "@/actions/summary";
import { DelayMessage } from "@/components/delay-message";
import {
  useChunks,
  useQuestionStore,
  useQuizStore,
} from "@/components/provider/page-provider";
import { apiClient } from "@/lib/api-client";
import { Condition, EventType } from "@/lib/constants";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages/pages.client";
import { SelectSummaryReady } from "@/lib/store/question-store";
import { reportSentry, scrollToElement } from "@/lib/utils";
import type { PageData } from "@/lib/pages/pages.client";
import type { SummaryResponse } from "@itell/core/summary";

import "@itell/driver.js/dist/driver.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@itell/ui/button";
import { Warning } from "@itell/ui/callout";
import { getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { type User } from "lucia";
import { SendHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import {
  getSummaryLocal,
  saveSummaryLocal,
  SummaryInput,
} from "./summary-input";
import { NextPageButton } from "./summary-next-page-button";

type Props = {
  user: User;
  page: PageData;
  pageStatus: PageStatus;
};

export function SummaryFormReread({ user, page, pageStatus }: Props) {
  const pageSlug = page.slug;
  const prevInput = useRef<string | undefined>(undefined);
  const quizStore = useQuizStore();
  const { ref, data: keystrokes, clear: clearKeystroke } = useKeystroke();
  const [finished, setFinished] = useState(pageStatus.unlocked);
  const questionStore = useQuestionStore();
  const chunks = useChunks();
  const isSummaryReady = useSelector(questionStore, SelectSummaryReady);
  const isMobile = useIsMobile();

  const randomChunkSlug = useMemo(() => {
    // skip first chunk, which is typically learning objectives
    const validChunks = chunks.slice(1);
    return validChunks[Math.floor(Math.random() * validChunks.length)];
  }, []);

  const { addPortal, removePortals, portals } = usePortal();
  const portalId = useRef<string | null>(null);
  const { addStage, clearStages, finishStage, stages } = useSummaryStage();
  const requestBodyRef = useRef<string>("");
  const summaryResponseRef = useRef<SummaryResponse | null>(null);

  const {
    isError,
    isDelayed,
    isPending: _isPending,
    action,
    error,
  } = useActionStatus(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      clearStages();
      addStage("Saving");

      const formData = new FormData(e.currentTarget);
      const input = String(formData.get("input")).replaceAll("\u0000", "");

      saveSummaryLocal(pageSlug, input);
      requestBodyRef.current = JSON.stringify({
        summary: input,
        page_slug: pageSlug,
      });
      console.log("requestBody", requestBodyRef.current);
      const response = await apiClient.api.summary.$post({
        json: {
          summary: input,
          page_slug: pageSlug,
        },
      });
      const json = await response.json();
      const parsed = SummaryResponseSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("summary response in wrong shape", {
          cause: parsed.error,
        });
      }
      const scores = parsed.data;
      summaryResponseRef.current = scores;

      const [_, err] = await createSummaryAction({
        summary: {
          text: input,
          pageSlug,
          condition: Condition.RANDOM_REREAD,
          isPassed: scores.is_passed ?? false,
          containmentScore: scores.containment,
          similarityScore: scores.similarity,
          languageScore: scores.language,
          contentScore: scores.content,
        },
        keystroke: {
          start: prevInput.current ?? getSummaryLocal(pageSlug) ?? "",
          data: keystrokes,
          isMobile: isMobile ?? false,
        },
      });
      if (err) {
        throw new Error("create summary action", { cause: err });
      }

      clearKeystroke();
      finishStage("Saving");
      setFinished(true);
      prevInput.current = input;

      if (isLastPage(page)) {
        toast.info("You have finished the entire textbook!");
        return;
      }

      if (page.quiz && page.quiz.length > 0 && !pageStatus.unlocked) {
        quizStore.send({
          type: "toggleQuiz",
        });
        return;
      }

      // 25% random rereading if the page is not unlocked
      if (!pageStatus.unlocked && Math.random() <= 0.25) {
        goToRandomChunk(randomChunkSlug);
      }
    },
    { delayTimeout: 10000 }
  );
  const isPending = useDebounce(_isPending, 100);

  useEffect(() => {
    driverObj.setConfig({
      animate: false,
      smoothScroll: false,
      allowClose: false,
      onHighlightStarted: (element) => {
        if (element) {
          element.setAttribute("tabIndex", "0");
          element.setAttribute("id", Elements.STAIRS_HIGHLIGHTED_CHUNK);

          // append link to jump to the finish reading button
          const link = document.createElement("a");
          link.href = `#${Elements.STAIRS_RETURN_BUTTON}`;
          link.textContent = "go to the finish reading button";
          link.className = "sr-only";
          link.id = Elements.STAIRS_ANSWER_LINK;
          element.insertAdjacentElement("afterend", link);
        }
      },
      onHighlighted: () => {
        setInertBackground(randomChunkSlug);
      },
      onPopoverRender: (popover) => {
        portalId.current = addPortal(
          <FinishReadingButton
            onClick={(time) => {
              exitChunk();

              createEventAction({
                type: EventType.RANDOM_REREAD,
                pageSlug,
                data: { chunkSlug: randomChunkSlug, time },
              });
            }}
          />,
          popover.wrapper
        );
      },
      onDestroyed: (element) => {
        removeInert();
        removePortals();
        if (element) {
          element.removeAttribute("tabIndex");
          element.removeAttribute("id");

          const link = document.getElementById(Elements.STAIRS_ANSWER_LINK);
          if (link) {
            link.remove();
          }
        }

        const assignments = document.getElementById(Elements.PAGE_ASSIGNMENTS);
        if (assignments) {
          setTimeout(() => {
            scrollToElement(element as HTMLElement);
          }, 100);
        }
        document.getElementById(Elements.SUMMARY_INPUT)?.focus();
      },
    });
  }, []);

  useEffect(() => {
    if (isError) {
      finishStage("Analyzing");
      clearStages();

      reportSentry("score summary reread", {
        body: requestBodyRef.current,
        response: summaryResponseRef.current,
        error: error?.cause,
      });
    }
  }, [isError]);

  return (
    <>
      <PortalContainer portals={portals} />
      <div className="flex flex-col gap-2" id={Elements.SUMMARY_FORM}>
        <div role="status">
          {finished && page.next_slug ? (
            <div className="space-x-2 space-y-2">
              <p>
                You have finished this page and can move on. You are still
                welcome to improve the summary.
              </p>
              <div className="flex items-center gap-2">
                <NextPageButton pageSlug={page.next_slug} />
              </div>
            </div>
          ) : null}
        </div>

        <h2 id="summary-form-heading" className="sr-only">
          submit summary
        </h2>
        <form
          className="space-y-4"
          onSubmit={action}
          aria-labelledby="summary-form-heading"
        >
          <SummaryInput
            disabled={!isSummaryReady}
            pageSlug={pageSlug}
            pending={isPending}
            stages={stages}
            userRole={user.role}
            ref={ref}
          />
          {isError ? (
            <Warning role="alert">{ErrorFeedback[ErrorType.INTERNAL]}</Warning>
          ) : null}
          {isDelayed ? <DelayMessage /> : null}
          <div className="flex justify-end">
            <Button
              disabled={!isSummaryReady || isPending}
              pending={isPending}
              type="submit"
            >
              <span className="flex items-center gap-2">
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

const driverObj = driver();

const exitChunk = () => {
  driverObj.destroy();
};

function FinishReadingButton({ onClick }: { onClick: (_: number) => void }) {
  const { time, clearTimer } = useTimer();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      className="space-y-2"
      id={Elements.STAIRS_CONTAINER}
      tabIndex={-1}
    >
      <p className="p-2 leading-tight tracking-tight">
        Please re-read the highlighted section. when you are finished, press the
        &quot;I finished rereading&quot; button.
      </p>

      <a className="sr-only" href={`#${Elements.STAIRS_HIGHLIGHTED_CHUNK}`}>
        go to the relevant section
      </a>
      <Button
        onClick={() => {
          onClick(time);
          clearTimer();
        }}
        size="sm"
        id={Elements.STAIRS_RETURN_BUTTON}
      >
        I finished rereading
      </Button>
    </div>
  );
}

const goToRandomChunk = (chunkSlug: string) => {
  const el = getChunkElement(chunkSlug, "data-chunk-slug");
  if (el) {
    setTimeout(() => {
      scrollToElement(el);
    }, 100);
    driverObj.highlight({
      element: el,
      popover: {
        description: "",
        side: "right",
        align: "start",
      },
    });
  }
};

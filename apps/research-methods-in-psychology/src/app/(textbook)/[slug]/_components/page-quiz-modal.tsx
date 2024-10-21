"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@itell/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@itell/ui/dialog";
import { useSelector } from "@xstate/store/react";
import { BookCheckIcon } from "lucide-react";

import {
  useQuizStore,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { isProduction, Tags } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages/pages.client";
import { SelectQuizFinished, SelectQuizOpen } from "@/lib/store/quiz-store";
import { PageQuiz } from "./page-quiz";
import type { PageData } from "@/lib/pages/pages.client";

export function PageQuizModal({
  page,
  pageStatus,
}: {
  page: PageData;
  pageStatus: PageStatus;
}) {
  const quizStore = useQuizStore();
  const summaryStore = useSummaryStore();
  const searchParams = useSearchParams();
  const quizOpen = useSelector(quizStore, SelectQuizOpen);
  const open = searchParams?.get("quiz") === "true" || quizOpen;
  const quizFinished = useSelector(quizStore, SelectQuizFinished);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!open || !isProduction) {
          quizStore.send({ type: "toggleQuiz" });
        }
      }}
    >
      {/* show button if page is unlocked but quiz is not finished in localStorage, this might happen if user refreshes the page
       */}
      {pageStatus.unlocked && quizFinished === false ? (
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <BookCheckIcon className="size-4" />
            Quiz
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent
        className="h-[80vh] max-w-4xl overflow-y-auto"
        canClose={false}
      >
        <DialogHeader>
          <DialogTitle>Quiz</DialogTitle>
          <DialogDescription>
            Test what you learned in this chapter by answering the following
            questions. You will be able to go the next chapter after you finish
            the quiz.
          </DialogDescription>
        </DialogHeader>
        <PageQuiz
          page={page}
          afterSubmit={() => {
            quizStore.send({ type: "finishQuiz" });
            summaryStore.send({
              type: "finishPage",
              isNextPageVisible: !isLastPage(page),
              input: "",
            });

            fetch("/api/revalidate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tag: Tags.GET_QUIZ_ATTEMPTS,
              }),
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

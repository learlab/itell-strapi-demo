"use client";

import {
  useQuizStore,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { isProduction } from "@/lib/constants";
import { isLastPage, type PageData } from "@/lib/pages/pages.client";
import { SelectQuizOpen } from "@/lib/store/quiz-store";
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

import { PageQuiz } from "./page-quiz";

export function PageQuizModal({
  page,
  showTrigger = false,
}: {
  page: PageData;
  showTrigger: boolean;
}) {
  const quizStore = useQuizStore();
  const summaryStore = useSummaryStore();
  const quizOpen = useSelector(quizStore, SelectQuizOpen);

  return (
    <Dialog
      open={quizOpen}
      onOpenChange={() => {
        if (!quizOpen) {
          quizStore.send({ type: "toggleQuiz" });
        }
      }}
    >
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <BookCheckIcon className="size-4" />
            Quiz
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent
        className="h-[80vh] max-w-4xl overflow-y-auto"
        canClose={!isProduction}
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
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

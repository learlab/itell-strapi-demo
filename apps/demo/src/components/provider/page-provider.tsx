"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useLocalStorage } from "@itell/core/hooks";
import { type Subscription } from "@xstate/store";
import { type Page } from "#content";

import { type PageStatus } from "@/lib/page-status";
import { createChatStore } from "@/lib/store/chat-store";
import { createQuestionStore } from "@/lib/store/question-store";
import { createQuizStore } from "@/lib/store/quiz-store";
import { createSummaryStore } from "@/lib/store/summary-store";
import { createStreakStore } from "@/lib/store/streak-store";
import type { ChatStore } from "@/lib/store/chat-store";
import type {
  ChunkQuestion,
  QuestionSnapshot,
  QuestionStore,
} from "@/lib/store/question-store";
import type { QuizStore } from "@/lib/store/quiz-store";
import type { SummaryStore } from "@/lib/store/summary-store";
import type { StreakStore } from "@/lib/store/streak-store";

type Props = {
  children: React.ReactNode;
  condition: string;
  page: Page;
  pageStatus: PageStatus;
  criStreak: number;
};

type State = {
  condition: string;
  chunks: string[];
  questionStore: QuestionStore;
  chatStore: ChatStore;
  summaryStore: SummaryStore;
  quizStore: QuizStore;
  streakStore: StreakStore;
};
const PageContext = createContext<State>({} as State);

export function PageProvider({ children, condition, page, pageStatus, criStreak }: Props) {
  const slugs = page.chunks.map(({ slug }) => slug);
  const [snapshot, setSnapshot] = useLocalStorage<QuestionSnapshot | undefined>(
    `question-store-${page.slug}`,
    undefined
  );
  const [quizFinished, setQuizFinished] = useLocalStorage<boolean | undefined>(
    `quiz-finished-${page.slug}`,
    page.quiz ? false : undefined
  );

  const [showFloatingSummary, setShowFloatingSummary] = useLocalStorage(
    "show-floating-summary",
    false
  );

  const [criAnswerStreak, setCriAnswerStreak] = useLocalStorage<number | undefined>(
    `cri-answer-streak`,
    undefined
  );

  const chunkQuestion = useMemo(() => {
    return getPageQuestions(page);
  }, [page]);

  const questionStoreRef = useRef<QuestionStore>(undefined);
  if (!questionStoreRef.current) {
    questionStoreRef.current = createQuestionStore(
      {
        chunks: page.chunks,
        pageStatus,
        chunkQuestion,
      },
      snapshot
    );
  }

  const chatStoreRef = useRef<ChatStore>(undefined);
  if (!chatStoreRef.current) {
    chatStoreRef.current = createChatStore();
  }

  const summaryStoreRef = useRef<SummaryStore>(undefined);
  if (!summaryStoreRef.current) {
    summaryStoreRef.current = createSummaryStore({
      pageStatus,
      showFloatingSummary,
    });
  }

  const quizStoreRef = useRef<QuizStore>(undefined);
  if (!quizStoreRef.current) {
    quizStoreRef.current = createQuizStore({
      finished: quizFinished,
      pageStatus,
    });
  }

  const streakStoreRef = useRef<StreakStore>(undefined);
  if (!streakStoreRef.current) {
    streakStoreRef.current = createStreakStore({
      criStreak,
    });
  }

  useEffect(() => {
    let questionSubscription: Subscription | undefined;
    let quizSubscription: Subscription | undefined;
    let summarySubscription: Subscription | undefined;
    let streakSubscription: Subscription | undefined;

    if (questionStoreRef.current) {
      questionSubscription = questionStoreRef.current.subscribe((state) => {
        setSnapshot(state.context);
      });
    }

    if (quizStoreRef.current) {
      quizSubscription = quizStoreRef.current.on("finishQuiz", () => {
        setQuizFinished(true);
      });
    }

    if (summaryStoreRef.current) {
      summarySubscription = summaryStoreRef.current.on(
        "toggleShowFloatingSummary",
        () => {
          setShowFloatingSummary((prev) => !prev);
        }
      );
    }

    if (streakStoreRef.current) {
      streakSubscription = streakStoreRef.current.subscribe((state) => {
        setCriAnswerStreak(state.context.criStreak);
      });
    }

    return () => {
      questionSubscription?.unsubscribe();
      quizSubscription?.unsubscribe();
      summarySubscription?.unsubscribe();
      streakSubscription?.unsubscribe();
    };
  }, [setQuizFinished, setShowFloatingSummary, setSnapshot, setCriAnswerStreak]);

  return (
    <PageContext.Provider
      value={{
        questionStore: questionStoreRef.current,
        chatStore: chatStoreRef.current,
        summaryStore: summaryStoreRef.current,
        quizStore: quizStoreRef.current,
        chunks: slugs,
        streakStore: streakStoreRef.current,
        condition,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export const useCondition = () => {
  const state = useContext(PageContext);
  return useMemo(() => state.condition, [state.condition]);
};

export const useChunks = () => {
  const state = useContext(PageContext);
  return useMemo(() => state.chunks, [state.chunks]);
};

export const useSummaryStore = () => {
  const value = useContext(PageContext);
  return value.summaryStore;
};

export const useChatStore = () => {
  const value = useContext(PageContext);
  return value.chatStore;
};

export const useQuestionStore = () => {
  const value = useContext(PageContext);
  return value.questionStore;
};

export const useQuizStore = () => {
  const value = useContext(PageContext);
  return value.quizStore;
};

export const useStreakStore = () => {
  const value = useContext(PageContext);
  return value.streakStore;
}

const getPageQuestions = (page: Page): ChunkQuestion => {
  if (page.cri.length === 0) {
    return {};
  }

  const chunkQuestion: ChunkQuestion = Object.fromEntries(
    page.chunks.map((chunk) => [chunk, false])
  );

  if (page.chunks.length > 0) {
    let withQuestion = false;
    page.cri.forEach((item) => {
      const baseProb = 1 / 3;

      // adjust the probability of cri based on the current streak
      // if (answerStreak >= 7) {
      //   baseProb = baseProb * 0.3;
      // } else if (answerStreak >= 5) {
      //   baseProb = baseProb * 0.5;
      // } else if (answerStreak >= 2) {
      //   baseProb = baseProb * 0.7;
      // }

      if (Math.random() < baseProb) {
        chunkQuestion[item.slug] = true;
        if (!withQuestion) {
          withQuestion = true;
        }
      }
    });

    // Each page will have at least one question

    if (!withQuestion) {
      const randomQuestion =
        page.cri[Math.floor(Math.random() * page.cri.length)];

      chunkQuestion[randomQuestion.slug] = true;
    }
  }

  return chunkQuestion;
};

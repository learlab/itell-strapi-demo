"use client";

import { useEffect } from "react";

import { getUserQuestionStreakAction } from "@/actions/question";
import { useServerAction } from "zsa-react";

import { reportSentry } from "../utils";

export function useAnswerStreak() {
  const { execute, data } = useServerAction(getUserQuestionStreakAction);

  useEffect(() => {
    execute().then(([_, error]) => {
      if (error && error.message !== "action unauthorized") {
        reportSentry("get user question streak", { error });
      }
    });
  }, []);

  return { data: data ?? 0 };
}

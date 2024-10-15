"use server";

import { events, users } from "@/drizzle/schema";
import { EventType, isProduction } from "@/lib/constants";
import { allPagesSorted, quizPages } from "@/lib/pages/pages.server";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { groupBy } from "es-toolkit";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";

import { db } from "./db";
import { authedProcedure } from "./utils";

const correctAnswers = quizPages
  .flatMap((page) =>
    page.quiz?.flatMap((q) =>
      q.answers
        .filter((q) => q.correct)
        .map((a) => ({ answer: a.answer, pageSlug: page.slug }))
    )
  )
  .filter(Boolean)
  .reduce(
    (acc, { answer, pageSlug }) => {
      acc[pageSlug] = acc[pageSlug] || [];
      acc[pageSlug].push(answer);
      return acc;
    },
    {} as Record<string, string[]>
  );

const getCorrectCount = (answers: string[], correctAnswers: string[]) => {
  if (answers.length !== correctAnswers.length) return 0;
  const correctCount = answers.filter(
    (answer, index) => answer === correctAnswers[index]
  ).length;
  return correctCount;
};

export const analyzeClassQuizAction = authedProcedure
  .input(
    z.object({
      ids: z.array(z.string()),
    })
  )
  .handler(async ({ input }) => {
    return await analyzeClassQuizhandler(input.ids);
  });

const analyzeClassQuizhandler = memoize(
  async (ids: string[]) => {
    const cte = db.$with("class_quiz").as(
      db
        .select({
          userId: events.userId,
          name: users.name,
          pageSlug: events.pageSlug,
          answers: sql<
            string[]
          >`jsonb_array_elements(${events.data}->'answers')->1`.as("answers"),
          createdAt: events.createdAt,
        })
        .from(events)
        .leftJoin(users, eq(events.userId, users.id))
        .where(
          and(inArray(events.userId, ids), eq(events.type, EventType.QUIZ))
        )
        .orderBy(events.userId, events.pageSlug, desc(events.createdAt))
    );
    const results = await db
      .with(cte)
      // if a student answer the same quiz multiple times
      // this will only count the last submission
      .selectDistinctOn([cte.userId, cte.pageSlug], {
        userId: cte.userId,
        name: cte.name,
        pageSlug: cte.pageSlug,
        answers: sql<string[]>`jsonb_agg(${cte.answers})`.as("answers"),
      })
      .from(cte)
      .groupBy(cte.userId, cte.pageSlug, cte.name);

    const analyzedResults = results.map((result) => {
      const pageCorrectAnswers = correctAnswers[result.pageSlug];

      const count = getCorrectCount(result.answers, pageCorrectAnswers);
      return {
        userId: result.userId,
        pageSlug: result.pageSlug,
        name: result.name || "Anonymous",
        count,
      };
    });

    return analyzedResults;
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: ["get-class-quiz"],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Analyze class quiz",
  }
);

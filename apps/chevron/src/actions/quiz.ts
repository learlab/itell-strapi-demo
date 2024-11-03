"use server";

import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";

import { events, users } from "@/drizzle/schema";
import { EventType, isProduction } from "@/lib/constants";
import { quizPages } from "@/lib/pages/pages.server";
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
  .reduce<Record<string, string[]>>((acc, { answer, pageSlug }) => {
    acc[pageSlug] = acc[pageSlug] || [];
    acc[pageSlug].push(answer);
    return acc;
  }, {});

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
      studentIds: z.array(z.string()),
      classId: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    return await analyzeClassQuizHandler(input.studentIds, ctx.user.id);
  });

const analyzeClassQuizHandler = memoize(
  async (ids: string[], _: string) => {
    const results = await db
      // select distinct to only get the latest submission for each user/page
      .selectDistinctOn([events.userId, events.pageSlug], {
        userId: events.userId,
        name: users.name,
        pageSlug: events.pageSlug,
        // the `answers` field has shape {answers: [[index, answer], ...]}
        // extract into an array of answer items for each submission
        answers: sql<
          string[]
        >`jsonb_path_query_array(${events.data},'$.answers[*][1]')`.as(
          "answers"
        ),
        createdAt: events.createdAt,
      })
      .from(events)
      .leftJoin(users, eq(events.userId, users.id))
      .where(and(inArray(events.userId, ids), eq(events.type, EventType.QUIZ)))
      .orderBy(events.userId, events.pageSlug, desc(events.createdAt));

    const analyzedResults = results.map((result) => {
      const pageCorrectAnswers = correctAnswers[result.pageSlug];

      const count = getCorrectCount(result.answers, pageCorrectAnswers);
      return {
        userId: result.userId,
        pageSlug: result.pageSlug,
        name: result.name ?? "Anonymous",
        count,
      };
    });

    return analyzedResults;
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: (_, userId) => ["get-class-quiz", userId],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Analyze class quiz",
  }
);

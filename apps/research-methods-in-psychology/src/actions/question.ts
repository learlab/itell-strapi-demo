"use server";

import { db } from "@/actions/db";
import {
  constructed_responses,
  constructed_responses_feedback,
  CreateConstructedResponseFeedbackSchema,
  CreateConstructedResponseSchema,
  users,
} from "@/drizzle/schema";
import { isProduction } from "@/lib/constants";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { authedProcedure } from "./utils";

/**
 * Create constructed response item
 */
export const createQuestionAnswerAction = authedProcedure
  .input(CreateConstructedResponseSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    if (isProduction) {
      return await db.insert(constructed_responses).values({
        ...input,
        userId: ctx.user.id,
      });
    }
  });

/**
 * Create constructed response feedback
 */
export const createQuestionFeedbackAction = authedProcedure
  .input(CreateConstructedResponseFeedbackSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    return await db.insert(constructed_responses_feedback).values({
      ...input,
      userId: ctx.user.id,
    });
  });

/**
 * Get question-answer statistics
 *
 * - all answers
 * - count answers by score
 */
export const getAnswerStatsAction = authedProcedure.handler(async ({ ctx }) => {
  return await db.transaction(async (tx) => {
    const records = await tx
      .select()
      .from(constructed_responses)
      .where(eq(constructed_responses.userId, ctx.user.id));

    const byScore = await tx
      .select({
        count: count(),
        score: constructed_responses.score,
      })
      .from(constructed_responses)
      .where(eq(constructed_responses.userId, ctx.user.id))
      .groupBy(constructed_responses.score);

    return { records, byScore };
  });
});

/**
 * Get question-answer statistics for class
 */
export const getAnswerStatsClassAction = authedProcedure
  .input(
    z.object({
      classId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    return await db.transaction(async (tx) => {
      const byScore = await tx
        .select({
          count: count(),
          score: constructed_responses.score,
        })
        .from(constructed_responses)
        .leftJoin(users, eq(users.id, constructed_responses.userId))
        .where(eq(users.classId, input.classId))
        .groupBy(constructed_responses.score);

      return { byScore };
    });
  });

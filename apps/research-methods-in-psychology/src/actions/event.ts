"use server";

import { db } from "@/actions/db";
import { CreateEventSchema, events } from "@/drizzle/schema";
import { EventType, isProduction, Tags } from "@/lib/constants";
import { and, eq } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";

import { authedProcedure } from "./utils";

/**
 * Create event
 */
export const createEventAction = authedProcedure
  .input(CreateEventSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    // if (isProduction) {
    return await db.insert(events).values({
      ...input,
      userId: ctx.user.id,
    });
    // }
  });

export const getUserQuizAttempts = authedProcedure.handler(async ({ ctx }) => {
  return await getUserQuizAttemptsHandler(ctx.user.id);
});

const getUserQuizAttemptsHandler = memoize(
  async (userId: string) => {
    const records = await db
      .select({
        pageSlug: events.pageSlug,
      })
      .from(events)
      .where(and(eq(events.userId, userId), eq(events.type, EventType.QUIZ)));

    return records;
  },
  {
    persist: false,
    revalidateTags: (userId) => [userId, Tags.GET_QUIZ_ATTEMPTS],
  }
);

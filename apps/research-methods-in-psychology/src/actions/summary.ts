"use server";

import { revalidateTag } from "next/cache";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";

import { db } from "@/actions/db";
import {
  CreateSummarySchema,
  events,
  summaries,
  users,
} from "@/drizzle/schema";
import {
  Condition,
  EventType,
  isProduction,
  PAGE_SUMMARY_THRESHOLD,
  Tags,
} from "@/lib/constants";
import { getPageData, isLastPage } from "@/lib/pages/pages.client";
import { isPageAfter, nextPage } from "@/lib/pages/pages.server";
import { authedProcedure } from "./utils";

/**
 * - Create summary record for current user
 * - If summary is passed or enough summaries has been written, update user's page slug to the next page that requires s summary, if user is at the last page, set finished to true
 * - Create keystroke events
 */
export const createSummaryAction = authedProcedure
  .input(
    z.object({
      summary: CreateSummarySchema.omit({ userId: true }),
      keystroke: z.object({
        start: z.string(),
        data: z.array(z.array(z.union([z.number(), z.string(), z.boolean()]))),
        isMobile: z.boolean(),
      }),
    })
  )
  .output(
    z.object({ nextPageSlug: z.string().nullable(), canProceed: z.boolean() })
  )
  .handler(async ({ input, ctx }) => {
    let shouldRevalidate = false;
    const data = await db.transaction(async (tx) => {
      // count
      let canProceed =
        input.summary.condition === Condition.STAIRS
          ? input.summary.isPassed
          : true;
      if (!canProceed) {
        const [record] = await tx
          .select({ count: count() })
          .from(summaries)
          .where(
            and(
              eq(summaries.userId, ctx.user.id),
              eq(summaries.pageSlug, input.summary.pageSlug)
            )
          );
        canProceed = record.count + 1 >= PAGE_SUMMARY_THRESHOLD;
      }

      // create summary record
      const { summaryId } = (
        await tx
          .insert(summaries)
          .values({
            ...input.summary,
            userId: ctx.user.id,
          })
          .returning({ summaryId: summaries.id })
      )[0];

      // create events
      if (isProduction) {
        await tx.insert(events).values({
          type: EventType.KEYSTROKE,
          pageSlug: input.summary.pageSlug,
          userId: ctx.user.id,
          data: {
            summaryId,
            start: input.keystroke.start,
            keystrokes: input.keystroke.data,
            isMobile: input.keystroke.isMobile,
          },
        });
      }

      // update user page slug
      const nextPageSlug = nextPage(input.summary.pageSlug);
      const shouldUpdateUserPageSlug = isPageAfter(
        nextPageSlug,
        ctx.user.pageSlug
      );

      if (canProceed) {
        shouldRevalidate = true;

        const page = getPageData(input.summary.pageSlug);
        if (page) {
          await tx
            .update(users)
            .set({
              pageSlug: shouldUpdateUserPageSlug ? nextPageSlug : undefined,
              finished: isLastPage(page),
            })
            .where(eq(users.id, ctx.user.id));
        }
      }

      return {
        nextPageSlug: shouldUpdateUserPageSlug
          ? nextPageSlug
          : ctx.user.pageSlug,
        canProceed,
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shouldRevalidate) {
      revalidateTag(Tags.GET_SESSION);
    }

    return data;
  });

/**
 * Get summary for class
 */
export const getSummariesClassAction = authedProcedure
  .input(z.object({ classId: z.string(), pageSlug: z.string().optional() }))
  .handler(async ({ input }) => {
    return await getSummariesClassHandler(input.classId, input.pageSlug);
  });
export const getSummariesClassHandler = memoize(
  async (classId: string, pageSlug?: string) => {
    return await db
      .select({
        id: summaries.id,
        text: summaries.text,
        pageSlug: summaries.pageSlug,
        isPassed: summaries.isPassed,
        createdAt: summaries.createdAt,
        updatedAt: summaries.updatedAt,
      })
      .from(summaries)
      .leftJoin(users, eq(users.id, summaries.userId))
      .where(
        and(
          eq(users.classId, classId),
          pageSlug !== undefined ? eq(summaries.pageSlug, pageSlug) : undefined
        )
      )
      .orderBy(desc(summaries.updatedAt));
  },
  {
    persist: false,
    // @ts-expect-error make server action check happy
    revalidateTags: async (classId, pageSlug) => [
      "get-summaries-class",
      classId,
      pageSlug ?? "",
    ],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Get summaries class",
  }
);

/**
 * Get summary for current user, if summary id is not provided, return all summaries
 */
export const getSummariesAction = authedProcedure
  .input(z.object({ summaryId: z.number().optional() }))
  .handler(async ({ input, ctx }) => {
    return await getSummariesHandler(ctx.user.id, input.summaryId);
  });

export const getSummariesHandler = memoize(
  async (userId: string, summaryId?: number) => {
    return await db
      .select()
      .from(summaries)
      .where(
        and(
          eq(summaries.userId, userId),
          summaryId !== undefined ? eq(summaries.id, summaryId) : undefined
        )
      )
      .orderBy(desc(summaries.updatedAt));
  },
  {
    persist: false,
    // @ts-expect-error make server action check happy
    revalidateTags: async (userId, summaryId) => [
      "get-summaries",
      userId,
      String(summaryId),
    ],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Get summaries",
  }
);

/**
 * Count summaries by pass / fail for current user and page
 */
export const countSummaryByPassingAction = authedProcedure
  .input(z.object({ pageSlug: z.string() }))
  .handler(async ({ input, ctx }) => {
    const record = await db
      .select({
        passed: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`),
        failed: count(sql`CASE WHEN NOT ${summaries.isPassed} THEN 1 END`),
      })
      .from(summaries)
      .where(
        and(
          eq(summaries.userId, ctx.user.id),
          eq(summaries.pageSlug, input.pageSlug)
        )
      );

    return record[0];
  });

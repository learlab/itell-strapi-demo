"use server";

import { db, first } from "@/actions/db";
import {
  CreateFocusTimeSchema,
  events,
  focus_times,
  FocusTimeData,
} from "@/drizzle/schema";
import {
  EventType,
  FOCUS_TIME_SAVE_INTERVAL,
  isProduction,
} from "@/lib/constants";
import { reportSentry } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";

import { authedProcedure } from "./utils";

/**
 * Response to focus time event
 * - add new record to the `events` table
 * - upsert record to the `focus_times` table, using page-user pair
 */
export const createFocusTimeAction = authedProcedure
  .input(CreateFocusTimeSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    if (isProduction) {
      const userId = ctx.user.id;

      await db.transaction(async (tx) => {
        // add events record
        await tx.insert(events).values({
          userId,
          type: EventType.FOCUS_TIME,
          pageSlug: input.pageSlug,
          data: input.data,
        });

        // check if the record exists under the same user-page pair
        const record = first(
          await tx
            .select()
            .from(focus_times)
            .where(
              and(
                eq(focus_times.userId, userId),
                eq(focus_times.pageSlug, input.pageSlug)
              )
            )
        );

        // update or insert focus_times record
        if (record) {
          const newData: FocusTimeData = {};
          const updateData = input.data as FocusTimeData;
          const oldData = record.data as FocusTimeData;
          // if there are legacy chunk ids that's not present in the new data
          // they will dropped during the update
          for (const chunkId in updateData) {
            if (chunkId in oldData) {
              newData[chunkId] = oldData[chunkId] + updateData[chunkId];
            } else {
              newData[chunkId] = updateData[chunkId];
            }
          }
          await tx
            .update(focus_times)
            .set({ data: newData })
            .where(
              and(
                eq(focus_times.userId, userId),
                eq(focus_times.pageSlug, input.pageSlug)
              )
            );
        } else {
          await tx.insert(focus_times).values({
            pageSlug: input.pageSlug,
            data: input.data as FocusTimeData,
            userId,
          });
        }
      });
    }
  });

export const getFocusTimeAction = authedProcedure
  .input(z.object({ pageSlug: z.string() }))
  .handler(async ({ input, ctx }) => {
    return await getFocusTimeHandler(ctx.user.id, input.pageSlug);
  });

const getFocusTimeHandler = memoize(
  async (userId: string, pageSlug: string) => {
    return first(
      await db
        .select()
        .from(focus_times)
        .where(
          and(
            eq(focus_times.userId, userId),
            eq(focus_times.pageSlug, pageSlug)
          )
        )
    );
  },
  {
    persist: true,
    duration: FOCUS_TIME_SAVE_INTERVAL / 1000,
    revalidateTags: (userId, pageSlug) => ["get-focus-time", userId, pageSlug],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Get focus time",
  }
);

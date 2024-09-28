"use server";

import { db, first } from "@/actions/db";
import { chat_messages, ChatMessageDataSchema } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { authedProcedure } from "./utils";

/**
 * Get chat messages for page
 */
export const getChatsAction = authedProcedure
  .input(z.object({ pageSlug: z.string() }))
  .handler(async ({ input, ctx }) => {
    const record = first(
      await db
        .select({
          data: chat_messages.data,
          updatedAt: chat_messages.updatedAt,
        })
        .from(chat_messages)
        .where(
          and(
            eq(chat_messages.userId, ctx.user.id),
            eq(chat_messages.pageSlug, input.pageSlug)
          )
        )
    );

    if (!record) {
      return {
        data: [],
        updatedAt: new Date(),
      };
    }

    return {
      data: record.data,
      updatedAt: record.updatedAt,
    };
  });

/**
 * Create chat messages to page, if the entry already exists, append messages to the existing `data` array
 */
export const createChatsAction = authedProcedure
  .input(
    z.object({
      pageSlug: z.string(),
      messages: z.array(ChatMessageDataSchema),
    })
  )
  .handler(async ({ input, ctx }) => {
    const record = first(
      await db
        .select()
        .from(chat_messages)
        .where(
          and(
            eq(chat_messages.userId, ctx.user.id),
            eq(chat_messages.pageSlug, input.pageSlug)
          )
        )
    );

    if (!record) {
      await db.insert(chat_messages).values({
        pageSlug: input.pageSlug,
        userId: ctx.user.id,
        data: input.messages,
      });
    } else {
      const newData = [...record.data, ...input.messages];
      await db
        .update(chat_messages)
        .set({ data: newData })
        .where(
          and(
            eq(chat_messages.userId, ctx.user.id),
            eq(chat_messages.pageSlug, input.pageSlug)
          )
        );
    }
  });

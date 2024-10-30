"use server";

import { revalidateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";
import { createServerAction } from "zsa";

import { db, findTeacher, findUser, first } from "@/actions/db";
import {
  chat_messages,
  constructed_responses,
  constructed_responses_feedback,
  CreateUserSchema,
  events,
  focus_times,
  oauthAccounts,
  summaries,
  TeacherSchema,
  UpdateUserSchema,
  users,
} from "@/drizzle/schema";
import { isProduction, Tags } from "@/lib/constants";
import { getPageData, isLastPage } from "@/lib/pages/pages.client";
import { firstPage, isPageAfter, nextPage } from "@/lib/pages/pages.server";
import { authedProcedure } from "./utils";

/**
 * Check if user is a teacher
 */
export const getTeacherAction = authedProcedure
  .output(TeacherSchema.nullable())
  .handler(async ({ ctx }) => {
    return await getTeacherActionHandler(ctx.user.id);
  });

const getTeacherActionHandler = memoize(
  async (userId: string) => {
    return findTeacher(userId);
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: (userId) => ["get-teacher", userId],
    log: isProduction ? [] : ["dedupe", "datacache", "verbose"],
    logid: "Get teacher",
  }
);

/**
 * Update current user
 */
export const updateUserAction = authedProcedure
  .input(UpdateUserSchema)
  .handler(async ({ input, ctx }) => {
    await db.update(users).set(input).where(eq(users.id, ctx.user.id));
    revalidateTag(Tags.GET_SESSION);
  });

export const updateUserPrefsAction = authedProcedure
  .input(
    z.object({
      preferences: z.object({
        theme: z.string().optional(),
        note_color_light: z.string().optional(),
        note_color_dark: z.string().optional(),
      }),
    })
  )
  .handler(async ({ input, ctx }) => {
    await db.transaction(async (tx) => {
      const user = first(
        await tx.select().from(users).where(eq(users.id, ctx.user.id))
      );
      if (user) {
        const prefs = user.preferences ?? {};
        if (input.preferences.theme) {
          prefs.theme = input.preferences.theme;
        }

        if (input.preferences.note_color_light) {
          prefs.note_color_light = input.preferences.note_color_light;
        }

        if (input.preferences.note_color_dark) {
          prefs.note_color_dark = input.preferences.note_color_dark;
        }

        if (Object.keys(prefs).length === 0) {
          return;
        }

        await tx
          .update(users)
          .set({ preferences: prefs })
          .where(eq(users.id, ctx.user.id));
      }
    });
  });

/**
 * Reset user progress, also deletes all user data, including summaries, answers, events, etc.
 */
export const resetUserAction = authedProcedure
  .output(z.object({ pageSlug: z.string() }))
  .handler(async ({ ctx }) => {
    const userId = ctx.user.id;
    return await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ finished: false, pageSlug: null })
        .where(eq(users.id, userId));
      await tx.delete(summaries).where(eq(summaries.userId, userId));
      await tx.delete(chat_messages).where(eq(chat_messages.userId, userId));
      await tx.delete(focus_times).where(eq(focus_times.userId, userId));
      await tx.delete(events).where(eq(events.userId, userId));
      await tx
        .delete(constructed_responses)
        .where(eq(constructed_responses.userId, userId));
      await tx
        .delete(constructed_responses_feedback)
        .where(eq(constructed_responses_feedback.userId, userId));

      return { pageSlug: firstPage.slug };
    });
  });

/**
 * Get user by id
 */
export const getUserAction = authedProcedure
  .input(z.object({ userId: z.string() }))
  .handler(async ({ input }) => {
    return await getUserActionHandler(input.userId);
  });

const getUserActionHandler = memoize(
  async (userId: string) => {
    return findUser(userId);
  },
  {
    persist: true,
    duration: 60,
    revalidateTags: (userId) => ["get-user", userId],
    log: isProduction ? [] : ["dedupe", "datacache", "verbose"],
    logid: "Get user",
  }
);

/**
 * Get user by OAuth provider
 */
export const getUserByProviderAction = createServerAction()
  .input(
    z.object({
      provider_id: z.enum(["google", "azure"]),
      provider_user_id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const joined = first(
      await db
        .select()
        .from(users)
        .innerJoin(oauthAccounts, eq(users.id, oauthAccounts.user_id))
        .where(
          and(
            eq(oauthAccounts.provider_id, input.provider_id),
            eq(oauthAccounts.provider_user_id, input.provider_user_id)
          )
        )
    );

    return joined?.users;
  });

/**
 * Create user with OAuth provider
 */
export const createUserAction = createServerAction()
  .input(
    z.object({
      user: CreateUserSchema,
      provider_id: z.enum(["google", "azure"]),
      provider_user_id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    return await db.transaction(async (tx) => {
      const [newUser] = await tx.insert(users).values(input.user).returning();

      await tx.insert(oauthAccounts).values({
        provider_id: input.provider_id,
        provider_user_id: input.provider_user_id,
        user_id: newUser.id,
      });
      return newUser;
    });
  });

/**
 Update user's page slug to the next page that requires a summary, if user is at the last page, set finished to true.

 This should only be used for the simple condition, for conditions with a summary, use createSummaryAction instead.
 */

export const incrementUserPageSlugAction = authedProcedure
  .input(z.object({ currentPageSlug: z.string() }))
  .handler(async ({ input, ctx }) => {
    const nextPageSlug = nextPage(input.currentPageSlug);
    const shouldUpdateUserPageSlug = isPageAfter(
      nextPageSlug,
      ctx.user.pageSlug
    );
    const page = getPageData(input.currentPageSlug);
    if (page) {
      await db
        .update(users)
        .set({
          pageSlug: shouldUpdateUserPageSlug ? nextPageSlug : undefined,
          finished: isLastPage(page),
        })
        .where(eq(users.id, ctx.user.id));
    }

    revalidateTag(Tags.GET_SESSION);

    return {
      nextPageSlug: shouldUpdateUserPageSlug ? nextPageSlug : ctx.user.pageSlug,
    };
  });

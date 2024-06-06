"use server";

import {
	events,
	chat_messages,
	constructed_responses,
	constructed_responses_feedback,
	focus_times,
	summaries,
	users,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db, findUser, first } from "../db";
import { firstSummaryPage, isLastPage, isPageAfter, nextPage } from "../pages";

export const getUser = async (userId: string) => {
	return first(await db.select().from(users).where(eq(users.id, userId)));
};

export const incrementUserPage = async (userId: string, pageSlug: string) => {
	const user = await findUser(userId);
	const nextSlug = nextPage(pageSlug);
	if (user) {
		const shouldUpdateUserPageSlug = isPageAfter(nextSlug, user.pageSlug);
		await db
			.update(users)
			.set({
				pageSlug: shouldUpdateUserPageSlug ? nextSlug : undefined,
				finished: isLastPage(pageSlug),
			})
			.where(eq(users.id, userId));
	}
	return nextSlug;
};

export const updateUser = async (
	userId: string,
	data: PgUpdateSetSource<typeof users>,
) => {
	return await db.update(users).set(data).where(eq(users.id, userId));
};

export const resetUser = async (userId: string) => {
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

		return firstSummaryPage.page_slug;
	});
};

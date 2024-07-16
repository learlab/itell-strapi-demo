"use server";

import {
	events,
	CreateUserInput,
	chat_messages,
	constructed_responses,
	constructed_responses_feedback,
	focus_times,
	oauthAccounts,
	summaries,
	users,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { generateIdFromEntropySize } from "lucia";
import { OAuthProvider } from "../auth/provider";
import { db, findUser, first } from "../db";
import {
	firstPage,
	firstSummaryPage,
	isLastPage,
	isPageAfter,
	nextPage,
} from "../pages";

export const getUser = async (userId: string) => {
	return first(await db.select().from(users).where(eq(users.id, userId)));
};

export const getUserByProvider = async ({
	provider_id,
	provider_user_id,
}: { provider_id: OAuthProvider; provider_user_id: string }) => {
	const joined = first(
		await db
			.select()
			.from(users)
			.innerJoin(oauthAccounts, eq(users.id, oauthAccounts.user_id))
			.where(
				and(
					eq(oauthAccounts.provider_id, provider_id),
					eq(oauthAccounts.provider_user_id, provider_user_id),
				),
			),
	);

	return joined?.users;
};

export const createUserTx = async ({
	user,
	provider_id,
	provider_user_id,
}: {
	user: Omit<CreateUserInput, "id">;
	provider_id: OAuthProvider;
	provider_user_id: string;
}) => {
	return await db.transaction(async (tx) => {
		const [newUser] = await tx
			.insert(users)
			.values({
				id: generateIdFromEntropySize(16),
				...user,
			})
			.returning();

		await tx.insert(oauthAccounts).values({
			provider_id,
			provider_user_id,
			user_id: newUser.id,
		});
		return newUser;
	});
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
			.set({ finished: false, pageSlug: firstPage.page_slug })
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

		return firstPage.page_slug;
	});
};

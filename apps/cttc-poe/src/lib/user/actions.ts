"use server";

import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db, findUser } from "../db";
import { isLastPage, isPageAfter, nextPage } from "../pages";
import { setUserPageSlug } from "./page-slug";

export const incrementUserPage = async (userId: string, pageSlug: string) => {
	const user = await findUser(userId);
	if (user) {
		const nextSlug = nextPage(pageSlug);
		const shouldUpdateUserPageSlug = isPageAfter(nextSlug, user.pageSlug);
		// only update a slug if user's slug is not greater
		if (shouldUpdateUserPageSlug) {
			setUserPageSlug(nextSlug);
		}
		await db
			.update(users)
			.set({
				pageSlug: shouldUpdateUserPageSlug ? nextSlug : undefined,
				finished: isLastPage(pageSlug),
			})
			.where(eq(users.id, userId));

		// revalidatePath(".");
	}
};

export const maybeFinishUser = async (userId: string, pageSlug: string) => {
	if (!userId || !isLastPage(pageSlug)) {
		return;
	}

	return await db
		.update(users)
		.set({ finished: true })
		.where(eq(users.id, userId));
};

export const updateUser = async (
	userId: string,
	data: PgUpdateSetSource<typeof users>,
) => {
	return await db.update(users).set(data).where(eq(users.id, userId));
};

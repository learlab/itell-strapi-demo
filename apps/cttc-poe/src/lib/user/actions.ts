"use server";

import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db, findUser } from "../db";
import { isLastPage, isPageAfter, nextPage } from "../pages";

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

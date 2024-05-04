"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import db from "../db";
import { isPageAfter, nextPage } from "../pages";
import { setUserPageSlug } from "./page-slug";

export const incrementUserPage = async (userId: string, pageSlug: string) => {
	"use server";
	const user = await db.user.findUnique({ where: { id: userId } });
	if (user) {
		const nextSlug = nextPage(pageSlug);
		// only update a slug if user's slug is not greater
		if (isPageAfter(nextSlug, user.pageSlug)) {
			setUserPageSlug(nextSlug);
			await db.user.update({
				where: {
					id: userId,
				},
				data: {
					pageSlug: nextSlug,
				},
			});

			revalidatePath(".");
		}
	}
};

export const updateUser = async (
	userId: string,
	data: Prisma.UserUpdateInput,
) => {
	return await db.user.update({
		where: {
			id: userId,
		},
		data,
	});
};

export const updateUserClassId = async ({
	userId,
	classId,
}: {
	userId: string;
	classId: string | null;
}) => {
	return await db.user.update({
		where: {
			id: userId,
		},
		data: {
			classId,
		},
	});
};

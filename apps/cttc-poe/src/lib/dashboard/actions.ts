"use server";

import { events, teachers, users } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { getSessionUser } from "../auth";
import { db, first } from "../db";

export const getTeacherWithClassId = async (classId: string | null) => {
	if (!classId) {
		return null;
	}
	const teacher = first(
		await db
			.select()
			.from(teachers)
			.where(and(eq(teachers.classId, classId), eq(teachers.isPrimary, true))),
	);

	if (!teacher) {
		return null;
	}

	const user = first(
		await db.select().from(users).where(eq(users.id, teacher.id)),
	);

	return user;
};

const _incrementView = async (pageSlug: string, data?: any) => {
	noStore();
	const user = await getSessionUser();
	if (user) {
		db.insert(events).values({
			type: "dashboard_page_view",
			pageSlug,
			userId: user.id,
			data,
		});
	}
};

export const incrementView = cache(_incrementView);

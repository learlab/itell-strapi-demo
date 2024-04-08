"use server";

import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { getCurrentUser } from "../auth";
import { isProduction } from "../constants";
import db from "../db";

export const getTeacherWithClassId = async (classId: string | null) => {
	if (!classId) {
		return null;
	}
	const teacher = await db.teacher.findFirst({
		where: {
			classId,
			isPrimary: true,
		},
	});

	if (!teacher) {
		return null;
	}

	const user = await db.user.findFirst({
		where: {
			id: teacher.id,
		},
	});

	return user;
};

const _incrementView = async (pageSlug: string) => {
	if (!isProduction) {
		return;
	}

	noStore();
	const user = await getCurrentUser();
	if (user) {
		await db.event.create({
			data: {
				eventType: "dashboard_page_view",
				pageSlug,
				userId: user.id,
			},
		});
	}
};

export const incrementView = cache(_incrementView);

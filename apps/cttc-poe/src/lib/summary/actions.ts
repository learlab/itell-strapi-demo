"use server";

import { SummaryResponse } from "@itell/core/summary";
import { Prisma } from "@prisma/client";
import { getSessionUser } from "../auth";
import db from "../db";

export const createSummary = async (input: Prisma.SummaryCreateInput) => {
	const user = await getSessionUser();
	if (user) {
		return await db.summary.create({
			data: input,
		});
	}
};

export const countUserPageSummary = async (
	userId: string,
	pageSlug: string,
) => {
	return await db.summary.count({
		where: {
			userId,
			pageSlug,
		},
	});
};

export const findFocusTime = async (userId: string, pageSlug: string) => {
	return await db.focusTime.findUnique({
		where: {
			userId_pageSlug: {
				userId,
				pageSlug,
			},
		},
	});
};

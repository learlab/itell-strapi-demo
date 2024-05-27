"use server";

import { focus_times, summaries } from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { PgInsertValue } from "drizzle-orm/pg-core";
import { db, first } from "../db";

export const createSummary = async (input: PgInsertValue<typeof summaries>) => {
	return await db.insert(summaries).values(input);
};

export const countUserPageSummary = async (
	userId: string,
	pageSlug: string,
) => {
	const record = first(
		await db
			.select({ count: count() })
			.from(summaries)
			.where(
				and(eq(summaries.userId, userId), eq(summaries.pageSlug, pageSlug)),
			),
	);
	return record ? record.count : 0;
};

export const findFocusTime = async (userId: string, pageSlug: string) => {
	return first(
		await db
			.select()
			.from(focus_times)
			.where(
				and(eq(focus_times.userId, userId), eq(focus_times.pageSlug, pageSlug)),
			),
	);
};

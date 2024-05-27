import { summaries } from "@/drizzle/schema";
import subDays from "date-fns/subDays";
import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "../db";

export const getRecentSummaries = async (userId: string) => {
	// fetch summaries during last week
	const targetDate = subDays(new Date(), 6);
	return await db
		.select()
		.from(summaries)
		.where(
			and(eq(summaries.userId, userId), gte(summaries.createdAt, targetDate)),
		)
		.orderBy(desc(summaries.createdAt));
};

export const getUserSummaries = async (userId: string) => {
	return await db
		.select()
		.from(summaries)
		.where(eq(summaries.userId, userId))
		.orderBy(desc(summaries.createdAt));
};

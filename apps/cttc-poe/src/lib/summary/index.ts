import { summaries } from "@/drizzle/schema";
import subDays from "date-fns/subDays";
import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "../db";

export const getRecentSummaries = async (uid: string) => {
	// fetch summaries during last week
	const targetDate = subDays(new Date(), 6);
	return await db
		.select()
		.from(summaries)
		.where(and(eq(summaries.userId, uid), gte(summaries.createdAt, targetDate)))
		.orderBy(desc(summaries.createdAt));
};

export const getUserSummaries = async (uid: string) => {
	return await db
		.select()
		.from(summaries)
		.where(eq(summaries.userId, uid))
		.orderBy(desc(summaries.createdAt));
};

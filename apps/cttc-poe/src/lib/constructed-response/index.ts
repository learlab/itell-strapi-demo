import { constructed_responses } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { db } from "../db";

export const getConstructedResponses = async (userId: string) => {
	return await db
		.select()
		.from(constructed_responses)
		.where(eq(constructed_responses.userId, userId));
};

export const getConstructedResponseScore = async (uid: string) => {
	return await db
		.select({ score: constructed_responses.score, count: count() })
		.from(constructed_responses)
		.where(eq(constructed_responses.userId, uid))
		.groupBy(constructed_responses.score);
};

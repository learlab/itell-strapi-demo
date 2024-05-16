import { Prisma } from "@prisma/client";
import subDays from "date-fns/subDays";
import db from "../db";

export const getRecentSummaries = async (uid: string) => {
	// fetch summaries during last week
	const targetDate = subDays(new Date(), 6);
	const summaries = await db.summary.findMany({
		where: {
			userId: uid,
			created_at: {
				gte: targetDate,
			},
		},
		orderBy: {
			created_at: "desc",
		},
	});
	return summaries;
};

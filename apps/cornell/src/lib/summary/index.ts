import { Prisma } from "@prisma/client";
import subDays from "date-fns/subDays";
import db from "../db";

export const getSummaryStats = async ({
	where,
}: { where: Prisma.SummaryWhereInput }) => {
	const [summaryStats, passedCount] = await Promise.all([
		db.summary.aggregate({
			_avg: {
				wordingScore: true,
				contentScore: true,
			},
			_count: true,
			where: where,
		}),
		db.summary.count({
			where: {
				...where,
				isPassed: true,
			},
		}),
	]);

	return {
		avgContentScore: summaryStats._avg.contentScore,
		avgWordingScore: summaryStats._avg.wordingScore,
		totalCount: summaryStats._count,
		passedCount: passedCount,
	};
};

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

export const getUserPageSummaryCount = async (
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

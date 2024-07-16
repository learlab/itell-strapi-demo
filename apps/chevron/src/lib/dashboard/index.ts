import {
	constructed_responses,
	summaries,
	teachers,
	users,
} from "@/drizzle/schema";
import { and, count, eq, inArray, sql } from "drizzle-orm";
import { db, first } from "../db";

export const getUserStats = async (id: string) => {
	const [summary, answer] = await Promise.all([
		db
			.select({
				languageScore: sql<
					number | null
				>`PERCENTILE_CONT(0.5) within group (order by ${summaries.languageScore})`,
				languageScoreLastWeek: sql<number | null>`
			PERCENTILE_CONT(0.5) within group (
			  order by ${summaries.languageScore}
			) FILTER (WHERE ${summaries.updatedAt} <= now() - INTERVAL '7 DAYS')
		  `,
				contentScore: sql<
					number | null
				>`PERCENTILE_CONT(0.5) within group (order by ${summaries.contentScore})`,
				contentScoreLastWeek: sql<number | null>`
			PERCENTILE_CONT(0.5) within group (
			  order by ${summaries.contentScore}
			) FILTER (WHERE ${summaries.updatedAt} <= now() - INTERVAL '7 DAYS')
		  `,
				count: count(),
				passedCount: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`),
				countLastWeek: count(
					sql`CASE WHEN ${summaries.updatedAt} <= now() - INTERVAL '7 DAYS' THEN 1 END`,
				),
				passedCountLastWeek: count(
					sql`CASE WHEN ${summaries.isPassed} AND ${summaries.updatedAt} <= now() - INTERVAL '7 DAYS' THEN 1 END`,
				),
			})
			.from(summaries)
			.where(eq(summaries.userId, id)),

		db
			.select({
				count: count(),
				passedCount: count(
					sql`CASE WHEN ${constructed_responses.score} = 2 THEN 1 END`,
				),
			})
			.from(constructed_responses)
			.where(eq(constructed_responses.userId, id)),
	]);

	return {
		contentScore: summary[0].contentScore,
		languageScore: summary[0].languageScore,
		contentScoreLastWeek: summary[0].contentScoreLastWeek,
		languageScoreLastWeek: summary[0].languageScoreLastWeek,
		totalSummaries: summary[0].count,
		totalPassedSummaries: summary[0].passedCount,
		totalSummariesLastWeek: summary[0].countLastWeek,
		totalPassedSummariesLastWeek: summary[0].passedCountLastWeek,
		totalAnswers: answer[0].count,
		totalPassedAnswers: answer[0].passedCount,
	};
};

export const getOtherStats = async (input: Array<{ id: string }>) => {
	const ids = input.map((u) => u.id);

	const _summaryCount = db.$with("_summaryCount").as(
		db
			.select({
				total: count().as("total"),
				passed: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`).as(
					"passed",
				),
			})
			.from(summaries)
			.groupBy(summaries.userId)
			.where(inArray(summaries.userId, ids)),
	);

	const _answerCount = db.$with("_answerCount").as(
		db
			.select({
				total: count().as("total"),
				passed: count(
					sql`CASE WHEN ${constructed_responses.score} = 2 THEN 1 END`,
				).as("passed"),
			})
			.from(constructed_responses)
			.groupBy(constructed_responses.userId)
			.where(inArray(constructed_responses.userId, ids)),
	);

	const [summaryScores, summaryCount, answerCount] = await Promise.all([
		db
			.select({
				languageScore: sql<
					number | null
				>`PERCENTILE_CONT(0.5) within group (order by ${summaries.languageScore})`,
				contentScore: sql<
					number | null
				>`PERCENTILE_CONT(0.5) within group (order by ${summaries.contentScore})`,
			})
			.from(summaries)
			.where(inArray(summaries.userId, ids)),

		db
			.with(_summaryCount)
			.select({
				total: sql<
					number | null
				>`PERCENTILE_CONT(0.5) within group (order by ${_summaryCount.total})`,
				passed: sql<
					number | null
				>`PERCENTILE_CONT(0.5) within group (order by ${_summaryCount.passed})`,
			})
			.from(_summaryCount),

		db
			.with(_answerCount)
			.select({
				total: sql<
					number | null
				>`PERCENTILE_CONT(0.5) within group (order by ${_answerCount.total})`,
				passed: sql<
					number | null
				>`PERCENTILE_CONT(0.5) within group (order by ${_answerCount.passed})`,
			})
			.from(_answerCount),
	]);

	return {
		contentScore: summaryScores[0].contentScore,
		languageScore: summaryScores[0].languageScore,
		totalSummaries: summaryCount[0].total || 0,
		totalPassedSummaries: summaryCount[0].passed || 0,
		totalAnswers: answerCount[0].total || 0,
		totalPassedAnswers: answerCount[0].passed || 0,
	};
};

export type UserStats = Awaited<ReturnType<typeof getUserStats>>;
export type OtherStats = Awaited<ReturnType<typeof getOtherStats>>;

export const getUserTeacherStatus = async (userId: string) => {
	const teacher = first(
		await db.select().from(teachers).where(eq(teachers.id, userId)),
	);

	if (!teacher || !teacher.classId) {
		return null;
	}

	return teacher;
};

export const getUserWithClass = async ({
	userId,
	classId,
}: { userId: string; classId: string }) => {
	const user = first(
		await db
			.select()
			.from(users)
			.where(and(eq(users.id, userId), eq(users.classId, classId))),
	);

	if (!user) {
		return null;
	}

	return user;
};

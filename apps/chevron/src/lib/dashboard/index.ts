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
				languageScore: sql<number>`PERCENTILE_CONT(0.5) within group (order by ${summaries.languageScore})`,
				contentScore: sql<number>`PERCENTILE_CONT(0.5) within group (order by ${summaries.contentScore})`,
				count: count(),
				passedCount: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`),
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
		contentScore: summary[0].contentScore || 0,
		languageScore: summary[0].languageScore || 0,
		totalSummaries: summary[0].count,
		totalPassedSummaries: summary[0].passedCount,
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
				languageScore: sql<number>`PERCENTILE_CONT(0.5) within group (order by ${summaries.languageScore})`,
				contentScore: sql<number>`PERCENTILE_CONT(0.5) within group (order by ${summaries.contentScore})`,
			})
			.from(summaries)
			.where(inArray(summaries.userId, ids)),

		db
			.with(_summaryCount)
			.select({
				total: sql<number>`PERCENTILE_CONT(0.5) within group (order by ${_summaryCount.total})`,
				passed: sql<number>`PERCENTILE_CONT(0.5) within group (order by ${_summaryCount.passed})`,
			})
			.from(_summaryCount),

		db
			.with(_answerCount)
			.select({
				total: sql<number>`PERCENTILE_CONT(0.5) within group (order by ${_answerCount.total})`,
				passed: sql<number>`PERCENTILE_CONT(0.5) within group (order by ${_answerCount.passed})`,
			})
			.from(_answerCount),
	]);

	return {
		contentScore: summaryScores[0].contentScore || 0,
		languageScore: summaryScores[0].languageScore || 0,
		totalSummaries: summaryCount[0].total,
		totalPassedSummaries: summaryCount[0].passed,
		totalAnswers: answerCount[0].total,
		totalPassedAnswers: answerCount[0].passed,
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

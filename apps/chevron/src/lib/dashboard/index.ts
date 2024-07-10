import {
	constructed_responses,
	summaries,
	teachers,
	users,
} from "@/drizzle/schema";
import { and, avg, count, eq, inArray, sql } from "drizzle-orm";
import { db, first } from "../db";

export const getUserStats = async (id: string) => {
	const [summary, answers] = await Promise.all([
		db
			.select({
				languageScore: avg(summaries.languageScore).mapWith(Number),
				contentScore: avg(summaries.contentScore).mapWith(Number),
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
		avgContentScore: summary[0].contentScore || 0,
		avgLanguageScore: summary[0].languageScore || 0,
		totalSummaries: summary[0].count,
		totalPassedSummaries: summary[0].passedCount,
		totalAnswers: answers[0].count,
		totalPassedAnswers: answers[0].passedCount,
	};
};

export const getOtherStats = async (users: Array<{ id: string }>) => {
	const ids = users.map((u) => u.id);
	const [summary, answers] = await Promise.all([
		db
			.select({
				languageScore: avg(summaries.languageScore).mapWith(Number),
				contentScore: avg(summaries.contentScore).mapWith(Number),
				count: count(),
				passedCount: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`),
			})
			.from(summaries)
			.where(inArray(summaries.userId, ids)),

		db
			.select({
				count: count(),
				passedCount: count(
					sql`CASE WHEN ${constructed_responses.score} = 2 THEN 1 END`,
				),
			})
			.from(constructed_responses)
			.where(inArray(constructed_responses.userId, ids)),
	]);

	return {
		avgContentScore: summary[0].contentScore || 0,
		avgLanguageScore: summary[0].languageScore || 0,
		avgTotalSummaries: summary[0].count / users.length,
		avgTotalPassedSummaries: summary[0].passedCount / users.length,
		avgTotalAnswers: answers[0].count / users.length,
		avgTotalPassedAnswers: answers[0].passedCount / users.length,
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

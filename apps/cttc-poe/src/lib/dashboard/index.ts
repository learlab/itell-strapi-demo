import {
	constructed_responses,
	summaries,
	teachers,
	users,
} from "@/drizzle/schema";
import { and, avg, eq, inArray } from "drizzle-orm";
import { db, first } from "../db";

export const getBadgeStats = async (ids: Array<{ id: string }>) => {
	if (ids.length === 0) {
		return {
			avgContentScore: 0,
			avgLanguageScore: 0,
			totalCount: 0,
			passedCount: 0,
			totalConstructedResponses: 0,
			passedConstructedResponses: 0,
		};
	}
	const users = ids.map((id) => id.id);
	const [scores, allSummaries, allConstructedResponses] = await Promise.all([
		db
			.select({
				languageScore: avg(summaries.languageScore).mapWith(Number),
				contentScore: avg(summaries.contentScore).mapWith(Number),
			})
			.from(summaries)
			.where(and(inArray(summaries.userId, users))),

		db
			.select()
			.from(summaries)
			.where(and(inArray(summaries.userId, users))),

		db
			.select()
			.from(constructed_responses)
			.where(and(inArray(constructed_responses.userId, users))),
	]);

	const score = first(scores);
	return {
		avgContentScore: score?.contentScore || 0,
		avgLanguageScore: score?.languageScore || 0,
		totalCount: allSummaries.length,
		passedCount: allSummaries.filter((s) => s.isPassed).length,
		totalConstructedResponses: allConstructedResponses.length,
		passedConstructedResponses: allConstructedResponses.filter(
			(cr) => cr.score === 2,
		).length,
	};
};

export type BadgeStats = Awaited<ReturnType<typeof getBadgeStats>>;

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

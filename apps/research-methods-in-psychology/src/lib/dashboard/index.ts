import {
	constructed_responses,
	summaries,
	teachers,
	users,
} from "@/drizzle/schema";
import subDays from "date-fns/subDays";
import { and, avg, eq, inArray } from "drizzle-orm";
import { getConstructedResponses } from "../constructed-response";
import { db, first } from "../db";
import { getUserSummaries } from "../summary";

export const getBadgeStats = async (userId: string) => {
	const startDate = subDays(new Date(), 7);
	const [userSummaries, answers] = await Promise.all([
		getUserSummaries(userId),
		getConstructedResponses(userId),
	]);
	const summariesLastWeek = [];
	const answersLastWeek = [];
	const passedSummaries = [];
	const passedSummariesLastWeek = [];
	const passedAnswers = [];
	const passedAnswersLastWeek = [];
	const contentScores: number[] = [];
	const languageScores: number[] = [];
	const contentScoresLastWeek: number[] = [];
	const languageScoresLastWeek: number[] = [];

	userSummaries.forEach((summary) => {
		const passed = summary.isPassed;
		const duringLastWeek = summary.createdAt > startDate;
		if (summary.contentScore) {
			contentScores.push(summary.contentScore);
		}
		if (summary.languageScore) {
			languageScores.push(summary.languageScore);
		}

		if (passed) {
			passedSummaries.push(summary);
		}
		if (duringLastWeek) {
			summariesLastWeek.push(summary);
			if (summary.contentScore) {
				contentScoresLastWeek.push(summary.contentScore);
			}
			if (summary.languageScore) {
				languageScoresLastWeek.push(summary.languageScore);
			}
		}
		if (passed && duringLastWeek) {
			passedSummariesLastWeek.push(summary);
		}
	});

	answers.forEach((answer) => {
		const passed = answer.score === 2;
		const duringLastWeek = answer.createdAt > startDate;

		if (passed) {
			passedAnswers.push(answer);
		}
		if (duringLastWeek) {
			answersLastWeek.push(answer);
		}
		if (passed && duringLastWeek) {
			passedAnswersLastWeek.push(answer);
		}
	});

	return {
		avgContentScore:
			contentScores.reduce((a, b) => a + b, 0) / contentScores.length,
		avgContentScoreLastWeek:
			contentScoresLastWeek.reduce((a, b) => a + b, 0) /
			contentScoresLastWeek.length,
		avgLanguageScore:
			languageScores.reduce((a, b) => a + b, 0) / languageScores.length,
		avgLanguageScoreLastWeek:
			languageScoresLastWeek.reduce((a, b) => a + b, 0) /
			languageScoresLastWeek.length,
		totalCount: userSummaries.length,
		totalCountLastWeek: summariesLastWeek.length,
		passedCount: passedSummaries.length,
		passedCountLastWeek: passedSummariesLastWeek.length,
		totalConstructedResponses: answers.length,
		totalConstructedResponsesLastWeek: answersLastWeek.length,
		passedConstructedResponses: passedAnswers.length,
		passedConstructedResponsesLastWeek: passedAnswersLastWeek.length,
	};
};

export const getClassBadgeStats = async (ids: Array<{ id: string }>) => {
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
	const students = ids.map((id) => id.id);
	const [scores, allSummaries, allConstructedResponses] = await Promise.all([
		db
			.select({
				languageScore: avg(summaries.languageScore).mapWith(Number),
				contentScore: avg(summaries.contentScore).mapWith(Number),
			})
			.from(summaries)
			.where(and(inArray(summaries.userId, students))),

		db
			.select()
			.from(summaries)
			.where(and(inArray(summaries.userId, students))),

		db
			.select()
			.from(constructed_responses)
			.where(and(inArray(constructed_responses.userId, students))),
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

"use server";

import { db, findUser, first } from "@/actions/db";
import {
	events,
	constructed_responses,
	focus_times,
	summaries,
	teachers,
	users,
} from "@/drizzle/schema";
import { isProduction } from "@/lib/constants";
import { reportSentry } from "@/lib/utils";
import { getGroupedReadingTime } from "@itell/core/dashboard";
import { and, count, eq, gte, inArray, ne, sql } from "drizzle-orm";
import { User } from "lucia";
import { unstable_noStore as noStore } from "next/cache";
import { memoize } from "nextjs-better-unstable-cache";
import { cache } from "react";
import { z } from "zod";
import { getTeacherAction, getUserAction } from "./user";
import { authedProcedure } from "./utils";

/**
 * Create dashboard_page_view event for page
 */
export const incrementViewAction = authedProcedure
	.createServerAction()
	.input(z.object({ pageSlug: z.string(), data: z.unknown() }))
	.handler(async ({ input, ctx }) => {
		if (isProduction) {
			await incrementViewHandler(ctx.user.id, input.pageSlug, input.data);
		}
	});

const incrementViewHandler = cache(
	async (userId: string, pageSlug: string, data?: unknown) => {
		noStore();
		await db.insert(events).values({
			type: "dashboard_page_view",
			pageSlug,
			userId,
			data,
		});
	},
);

/**
 * Count user summaries with a start date for current user
 */
export const countSummaryAction = authedProcedure
	.createServerAction()
	.input(z.object({ startDate: z.date() }))
	.output(z.number())
	.handler(async ({ input, ctx }) => {
		const record = first(
			await db
				.select({
					count: count(),
				})
				.from(summaries)
				.where(
					and(
						eq(summaries.userId, ctx.user.id),
						gte(summaries.createdAt, input.startDate),
					),
				),
		);
		return record?.count ?? 0;
	});
/**
 * Get data for reading time chart for current user
 */
export const getReadingTimeAction = authedProcedure
	.createServerAction()
	.input(
		z.object({
			startDate: z.date(),
			intervalDates: z.array(z.date()),
		}),
	)
	.handler(async ({ input, ctx }) => {
		return await getReadingTimeHandler(
			ctx.user.id,
			input.startDate,
			input.intervalDates,
		);
	});

const getReadingTimeHandler = memoize(
	async (userId: string, startDate: Date, intervalDates: Date[]) => {
		// TODO: fix this query or how we store focus time data
		// for records created before start date, they can still be updated
		// but this won't be reflected in the reading time
		const dataExpanded = db.$with("expanded").as(
			db
				.select({
					value: sql`(jsonb_each(${focus_times.data})).value`.as("value"),
					createdAt: sql<Date>`${focus_times.createdAt}::date`.as("createdAt"),
				})
				.from(focus_times)
				.where(
					and(
						eq(focus_times.userId, userId),
						gte(focus_times.createdAt, startDate),
					),
				),
		);

		const records = await db
			.with(dataExpanded)
			.select({
				totalViewTime: sql<number>`sum(value::integer)::integer`.as(
					"totalViewTime",
				),
				createdAt: dataExpanded.createdAt,
			})
			.from(dataExpanded)
			.groupBy(dataExpanded.createdAt);

		const readingTimeGrouped = await getGroupedReadingTime(
			records,
			intervalDates,
		);
		return readingTimeGrouped;
	},
	{
		persist: true,
		duration: 60 * 5,
		revalidateTags: (userId, startDate) => [
			"reading-time",
			userId,
			startDate.toLocaleDateString(),
		],
		additionalCacheKey: ["reading-time"],
		log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
		logid: "Reading time",
		suppressWarnings: true,
	},
);

/**
 * Get user statistics for `<UserRadarChart />`
 */
export const getUserStatsAction = authedProcedure
	.createServerAction()
	.onError((err) => {
		reportSentry("get user stats", { error: err });
	})
	.handler(async ({ ctx }) => {
		return await getUserStatsHandler(ctx.user.id);
	});

const getUserStatsHandler = memoize(
	async (userId: string) => {
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
				.where(eq(summaries.userId, userId)),

			db
				.select({
					count: count(),
					passedCount: count(
						sql`CASE WHEN ${constructed_responses.score} = 2 THEN 1 END`,
					),
				})
				.from(constructed_responses)
				.where(eq(constructed_responses.userId, userId)),
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
	},
	{
		persist: true,
		duration: 60,
		revalidateTags: (id) => ["user-stats", id],
		log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
		logid: "User stats",
	},
);
/**
 * Get other users' statistics for `<UserRadarChart />`
 */
export const getOtherStatsAction = authedProcedure
	.createServerAction()
	.input(z.object({ ids: z.array(z.string()) }))
	.onError((err) => {
		reportSentry("get other stats", { error: err });
	})
	.handler(async ({ input }) => {
		return await getOtherStatsHandler(input.ids);
	});

const getOtherStatsHandler = memoize(
	async (ids: string[]) => {
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
	},
	{
		persist: true,
		duration: 60 * 5,
		revalidateTags: ["other-stats"],
		log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
		logid: "Other stats",
	},
);

export type UserStats = Awaited<ReturnType<typeof getUserStatsHandler>>;
export type OtherStats = Awaited<ReturnType<typeof getOtherStatsHandler>>;

/**
 * Get an array of users to compare with the current user
 *
 * - If user is in a class, get all other users in the class
 * - If user is not in a class, get all other users
 */
export const getOtherUsersAction = authedProcedure
	.createServerAction()
	.onError((err) => {
		reportSentry("get other users", { error: err });
	})
	.handler(async ({ ctx }) => {
		return await getOtherUsersHandler(ctx.user);
	});

const getOtherUsersHandler = memoize(
	async (user: User) => {
		if (user.classId) {
			return await db
				.select({
					id: users.id,
					pageSlug: users.pageSlug,
				})
				.from(users)
				.where(and(eq(users.classId, user.classId)));
		}

		return await db
			.select({ id: users.id, pageSlug: users.pageSlug })
			.from(users)
			.where(ne(users.id, users.id))
			.limit(100);
	},
	{
		persist: true,
		duration: 60 * 5,
		revalidateTags: ["get-other-users"],
		log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
		logid: "Get other users",
	},
);

/**
 * Get students by classId, alongside with their summary count
 */
export const getClassStudentsAction = authedProcedure
	.createServerAction()
	.input(z.object({ classId: z.string() }))
	.onError((err) => {
		reportSentry("get class students", { error: err });
	})
	.handler(async ({ input }) => {
		return await getClassStudentsHandler(input.classId);
	});

const getClassStudentsHandler = memoize(
	async (classId: string) => {
		return await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				pageSlug: users.pageSlug,
				createdAt: users.createdAt,
				summaryCount: count(),
			})
			.from(users)
			.where(eq(users.classId, classId))
			.leftJoin(summaries, eq(summaries.userId, users.id))
			.groupBy(users.id)
			.orderBy(users.id);
	},
	{
		persist: true,
		duration: 60 * 5,
		revalidateTags: ["get-class-students"],
		log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
		logid: "Get class students",
	},
);

/**
 * Get a user by id, current user must be a teacher and the user must be in the teacher's class
 */
export const getStudent = authedProcedure
	.createServerAction()
	.input(z.object({ userId: z.string() }))
	.handler(async ({ input, ctx }) => {
		const user = await findUser(input.userId);
		if (!user) {
			return null;
		}

		if (ctx.user.classId !== user.classId) {
			return null;
		}

		getTeacherAction;
	});

/**
 * Count students in class
 */
export const countStudentAction = authedProcedure
	.createServerAction()
	.input(z.object({ classId: z.string() }))
	.output(z.number())
	.onError((err) => {
		reportSentry("count student", { error: err });
	})
	.handler(async ({ input }) => {
		return await countStudentHandler(input.classId);
	});

const countStudentHandler = memoize(
	async (classId: string) => {
		const record = first(
			await db
				.select({
					count: count(),
				})
				.from(users)
				.where(eq(users.classId, classId)),
		);

		return record?.count ?? 0;
	},
	{
		persist: true,
		duration: 60 * 5,
		revalidateTags: (classId) => ["count-student", classId],
		log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
		logid: "Count student",
	},
);

/**
 * Get the teacher for classId, then get the user account for the teacher
 */
export const getTeacherByClassAction = authedProcedure
	.createServerAction()
	.input(z.object({ classId: z.string() }))
	.onError((err) => {
		reportSentry("get teacher by class", { error: err });
	})
	.handler(async ({ input }) => {
		return await getTeacherByClassHandler(input.classId);
	});

const getTeacherByClassHandler = async (classId: string) => {
	const teacher = first(
		await db
			.select()
			.from(teachers)
			.where(and(eq(teachers.classId, classId), eq(teachers.isPrimary, true))),
	);

	if (!teacher) {
		return null;
	}

	return await findUser(teacher.id);
};

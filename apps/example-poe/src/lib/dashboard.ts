import { type Prisma } from "@prisma/client";
import db from "./db";
import { format, subDays } from "date-fns";
import { getDatesBetween } from "@itell/core/utils";
import { FocusTimeData, getTotalViewTime } from "./focus-time";

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

export const getClassStudents = async (classId: string) => {
	return await db.user.findMany({
		where: {
			classId,
		},
	});
};

export const getClassStudentStats = async (classId: string) => {
	const students = await db.user.findMany({
		where: {
			classId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			chapter: true,
			section: true,
			created_at: true,
			_count: {
				select: {
					summaries: true,
				},
			},
		},
	});

	return students;
};

export const getStudentsCount = async (classId: string) => {
	return await db.user.count({
		where: {
			classId,
		},
	});
};

export const getReadingTime = async (uid: string) => {
	// fetch reading time during last week
	const today = new Date();
	const startDate = subDays(new Date(), 6);
	const data = await db.focusTime.findMany({
		where: {
			userId: uid,
			created_at: {
				gte: startDate,
			},
		},
	});

	const readingTimeByDay = data.reduce((acc, entry) => {
		const date = format(entry.created_at, "yyyy-MM-dd");
		const entryTotalViewTime =
			entry.totalViewTime || getTotalViewTime(entry.data as FocusTimeData[]);
		acc.set(date, (acc.get(date) || 0) + entryTotalViewTime);
		return acc;
	}, new Map<string, number>());

	const dates = getDatesBetween(startDate, today).map((d) =>
		format(d, "yyyy-MM-dd"),
	);
	let totalViewTime = 0;
	const chartData = [];
	for (const date of dates) {
		totalViewTime += readingTimeByDay.get(date) || 0;
		chartData.push({
			name: format(new Date(date), "LLL, dd"),
			value: (readingTimeByDay.get(date) || 0) / 60,
		});
	}

	return { chartData, totalViewTime };
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

export const getUserTeacherStatus = async (uid: string) => {
	const teacher = await db.teacher.findUnique({
		where: {
			id: uid,
		},
	});

	if (!teacher || !teacher.classId) {
		return null;
	}

	return teacher;
};

export const getUserWithClass = async ({
	userId,
	classId,
}: { userId: string; classId: string }) => {
	const user = await db.user.findFirst({
		where: {
			id: userId,
			classId,
		},
	});

	if (!user) {
		return null;
	}

	return user;
};

export const userIsStudent = async (uid: string) => {
	return Boolean(
		(
			await db.user.findUnique({
				where: {
					id: uid,
				},
			})
		)?.classId,
	);
};

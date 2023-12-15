import { type Prisma } from "@prisma/client";
import db from "./db";
import { subDays } from "date-fns";

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
	return await db.user.findMany({
		where: {
			classId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			chapter: true,
			created_at: true,
			_count: {
				select: {
					summaries: true,
				},
			},
		},
	});
};

export const getStudentsCount = async (classId: string) => {
	return await db.user.count({
		where: {
			classId,
		},
	});
};

export const getRecentSummaries = async (uid: string) => {
	// fetch summaries during last week
	const targetDate = subDays(new Date(), 7);
	const summaries = await db.summary.findMany({
		where: {
			userId: uid,
			created_at: {
				gt: targetDate,
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

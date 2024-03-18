import db from "../db";

export const getClassStudents = async (classId: string) => {
	return await db.user.findMany({
		where: {
			classId,
		},
	});
};
export type StudentStats = Awaited<ReturnType<typeof getClassStudentStats>>;
export const getClassStudentStats = async (classId: string) => {
	const students = await db.user.findMany({
		where: {
			classId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			pageSlug: true,
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

export const countStudent = async (classId: string) => {
	return await db.user.count({
		where: {
			classId,
		},
	});
};

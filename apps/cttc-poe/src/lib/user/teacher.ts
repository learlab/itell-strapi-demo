import db from "../db";

export const isTeacher = async (userId: string) => {
	const teacher = await db.teacher.findUnique({
		where: {
			id: userId,
		},
	});

	return !!teacher;
};

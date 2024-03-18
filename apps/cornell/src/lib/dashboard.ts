import db from "./db";

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

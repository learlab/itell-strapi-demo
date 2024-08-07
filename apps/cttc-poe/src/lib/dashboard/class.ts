import { summaries, users } from "@/drizzle/schema";
import { and, count, eq, ne } from "drizzle-orm";
import { db, first } from "../db";

export const getOtherUsers = async (
	arg: { classId: string } | { userId: string },
) => {
	if ("classId" in arg) {
		return await db
			.select({
				id: users.id,
				pageSlug: users.pageSlug,
			})
			.from(users)
			.where(and(eq(users.classId, arg.classId)));
	}

	if ("userId" in arg) {
		return await db
			.select({ id: users.id, pageSlug: users.pageSlug })
			.from(users)
			.where(ne(users.id, arg.userId));
	}

	return [];
};
export type StudentStats = Awaited<ReturnType<typeof getClassStudentStats>>;
export const getClassStudentStats = async (classId: string) => {
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
};

export const countStudent = async (classId: string) => {
	const record = first(
		await db
			.select({
				count: count(),
			})
			.from(users)
			.where(eq(users.classId, classId)),
	);

	return record?.count ?? 0;
};

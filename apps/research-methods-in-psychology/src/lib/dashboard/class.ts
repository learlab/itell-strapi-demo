import { summaries, users } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { db, first } from "../db";

export const getClassStudents = async (classId: string) => {
	return await db
		.select({
			id: users.id,
		})
		.from(users)
		.where(eq(users.classId, classId));
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

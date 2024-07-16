import { teachers } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { db, first } from "../db";

export const isTeacher = async (userId: string) => {
	return first(
		await db
			.select()
			.from(teachers)
			.where(and(eq(teachers.id, userId), eq(teachers.isApproved, true))),
	);
};

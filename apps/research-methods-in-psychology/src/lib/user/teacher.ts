import { teachers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { db, first } from "../db";

export const isTeacher = async (userId: string) => {
	return first(await db.select().from(teachers).where(eq(teachers.id, userId)));
};

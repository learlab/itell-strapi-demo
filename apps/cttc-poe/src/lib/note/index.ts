import { notes } from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { SessionUser, getSessionUser } from "../auth";
import { db } from "../db";

export const getNotes = async (userId: string, pageSlug: string) => {
	return await db
		.select()
		.from(notes)
		.where(and(eq(notes.userId, userId), eq(notes.pageSlug, pageSlug)));
};

export const countNoteHighlight = async (userId: string, pageSlug: string) => {
	return await db
		.select({
			type: sql<string>`CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END`,
			count: sql<number>`COUNT(*)::integer`,
		})
		.from(notes)
		.where(and(eq(notes.userId, userId), eq(notes.pageSlug, pageSlug)))
		.groupBy(
			sql<string>`CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END`,
		);
};

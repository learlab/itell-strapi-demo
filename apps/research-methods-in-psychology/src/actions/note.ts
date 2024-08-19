"use server";

import { db } from "@/actions/db";
import { CreateNoteSchema, UpdateNoteSchema, notes } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authedProcedure } from "./utils";

export const createNoteAction = authedProcedure
	.input(CreateNoteSchema.omit({ userId: true }))
	.handler(async ({ input, ctx }) => {
		return (
			await db
				.insert(notes)
				.values({
					...input,
					userId: ctx.user.id,
				})
				.returning()
		)[0];
	});

export const updateNoteAction = authedProcedure
	.input(z.object({ id: z.number(), data: UpdateNoteSchema }))
	.handler(async ({ input }) => {
		await db.update(notes).set(input.data).where(eq(notes.id, input.id));
	});

/**
 * Get notes for page
 */
export const getNotesAction = authedProcedure
	.input(z.object({ pageSlug: z.string() }))
	.handler(async ({ input, ctx }) => {
		return await db
			.select()
			.from(notes)
			.where(
				and(eq(notes.userId, ctx.user.id), eq(notes.pageSlug, input.pageSlug)),
			);
	});

/**
 * Delete a note
 */
export const deleteNoteAction = authedProcedure
	.input(z.object({ id: z.number() }))
	.handler(async ({ input, ctx }) => {
		return await db.delete(notes).where(eq(notes.id, input.id));
	});

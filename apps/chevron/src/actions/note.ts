"use server";

import { db } from "@/actions/db";
import { CreateNoteSchema, UpdateNoteSchema, notes } from "@/drizzle/schema";
import { reportSentry } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authedProcedure } from "./utils";

/**
 * Create a note
 */
export const createNoteAction = authedProcedure
	.createServerAction()
	.input(CreateNoteSchema.omit({ userId: true }))
	.onError((error) => {
		reportSentry("create-note", { error });
	})
	.handler(async ({ input, ctx }) => {
		const record = await db
			.insert(notes)
			.values({
				...input,
				userId: ctx.user.id,
			})
			.returning();
		return record[0];
	});

/**
 * Update a note
 */

export const updateNoteAction = authedProcedure
	.createServerAction()
	.input(z.object({ id: z.number(), data: UpdateNoteSchema }))
	.onError((error) => {
		reportSentry("update-note", { error });
	})
	.handler(async ({ input }) => {
		await db.update(notes).set(input.data).where(eq(notes.id, input.id));
	});

/**
 * Get notes for page
 */
export const getNotesAction = authedProcedure
	.createServerAction()
	.input(z.object({ pageSlug: z.string() }))
	.onError((error) => {
		reportSentry("get-notes", { error });
	})
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
	.createServerAction()
	.input(z.object({ id: z.number() }))
	.onError((error) => {
		reportSentry("delete-note", { error });
	})
	.handler(async ({ input, ctx }) => {
		return await db.delete(notes).where(eq(notes.id, input.id));
	});

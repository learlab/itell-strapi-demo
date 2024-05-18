"use server";

import { notes } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { PgInsertValue, PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db, first } from "../db";

export const deleteNote = async (id: number) => {
	await db.delete(notes).where(eq(notes.id, id));
};

export const createNote = async (values: PgInsertValue<typeof notes>) => {
	return first(await db.insert(notes).values(values).returning());
};

export const updateNote = async (
	id: number,
	data: PgUpdateSetSource<typeof notes>,
) => {
	await db.update(notes).set(data).where(eq(notes.id, id));
};

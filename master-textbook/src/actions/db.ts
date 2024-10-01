import { env } from "@/env.mjs";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "server-only";
import * as schema from "../drizzle/schema";

export const client = postgres(env.DATABASE_URL, { prepare: false });
// { schema } is used for relational queries
export const db = drizzle(client, { schema });

export const first = <T>(res: T[]) => (res.length > 0 ? res[0] : null);

export const findUser = async (id: string) => {
	return first(
		await db.select().from(schema.users).where(eq(schema.users.id, id)),
	);
};

export const findTeacher = async (id: string) => {
	return first(
		await db
			.select()
			.from(schema.teachers)
			.where(
				and(eq(schema.teachers.id, id), eq(schema.teachers.isApproved, true)),
			),
	);
};

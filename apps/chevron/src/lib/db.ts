import { env } from "@/env.mjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";

export const client = postgres(env.DATABASE_URL, { prepare: false });
// { schema } is used for relational queries
export const db = drizzle(client, { schema });

export const findUser = async (id: string) => {
	const result = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.id, id));
	return result[0];
};

export const first = <T>(res: T[]) => (res.length > 0 ? res[0] : null);

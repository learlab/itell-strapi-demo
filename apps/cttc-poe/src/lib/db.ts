import { env } from "@/env.mjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../drizzle/schema";

export const client = new Client({
	connectionString: env.DATABASE_URL,
});

(async () => {
	await client.connect();
})();

// { schema } is used for relational queries
export const db = drizzle(client, { schema });

export const findUser = async (id: string) => {
	const result = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.id, id));
	return result[0];
};

export const first = <T>(arr: T[]) => arr[0];

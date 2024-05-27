import { users } from "@/drizzle/schema";
import { db, first } from "@/lib/db";
import { eq } from "drizzle-orm";

export const getUser = async (userId: string) => {
	return first(await db.select().from(users).where(eq(users.id, userId)));
};

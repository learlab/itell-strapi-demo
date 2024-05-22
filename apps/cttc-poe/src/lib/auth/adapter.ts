import { sessions, users } from "@/drizzle/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db";

export const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

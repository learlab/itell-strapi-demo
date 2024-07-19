import { db } from "@/actions/db";
import { sessions, users } from "@/drizzle/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, User as LuciaUser } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			name: attributes.name,
			image: attributes.image,
			email: attributes.email,
			role: attributes.role,
			condition: attributes.condition,
			finished: attributes.finished,
			classId: attributes.classId,
			pageSlug: attributes.pageSlug,
			timeZone: attributes.timeZone,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

interface DatabaseUserAttributes {
	id: string;
	name: string | null;
	image: string | null;
	email: string | null;
	role: string;
	condition: string;
	finished: boolean;
	classId: string | null;
	pageSlug: string | null;
	timeZone: string | null;
}

interface DatabaseSessionAttributes {}

export type SessionUser = LuciaUser | null;

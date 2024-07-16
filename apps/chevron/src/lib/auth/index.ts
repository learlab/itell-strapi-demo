import { sessions, users } from "@/drizzle/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, Session as LuciaSession, User as LuciaUser } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";
import { db } from "../db";
import { reportSentry } from "../utils";

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

export const getSession = cache(
	async (): Promise<
		{ user: LuciaUser; session: LuciaSession } | { user: null; session: null }
	> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null,
			};
		}
		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes,
				);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes,
				);
			}
		} catch (err) {
			reportSentry("get session", { error: err });
		}
		return result;
	},
);

export type Session = Awaited<ReturnType<typeof getSession>>;
export type SessionUser = LuciaUser | null;

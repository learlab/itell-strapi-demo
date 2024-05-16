import * as Sentry from "@sentry/nextjs";
import { Lucia, Session as LuciaSession, User as LuciaUser } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";
import { adapter } from "./adapter";

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
			finished: attributes.finished,
			prolific_pid: attributes.prolificId,
			page_slug: attributes.pageSlug,
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
	name: string | undefined;
	image: string | undefined;
	email: string | undefined;
	role: string;
	finished: boolean;
	prolificId: string | undefined;
	pageSlug: string | undefined;
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
			Sentry.captureMessage("get session error", {
				extra: {
					msg: JSON.stringify(err),
				},
			});
		}
		return result;
	},
);

export async function getSessionUser() {
	const { user } = await getSession();
	return user;
}
export type Session = Awaited<ReturnType<typeof getSession>>;
export type SessionUser = Awaited<ReturnType<typeof getSessionUser>>;

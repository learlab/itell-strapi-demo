"use server";
import { reportSentry } from "@/lib/utils";
import { User, Session as _Session } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";
import { lucia } from "./lucia";

export const getSession = cache(
	async (): Promise<
		{ user: User; session: _Session } | { user: null; session: null }
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

export const logout = async () => {
	const { session } = await getSession();
	if (session) {
		await lucia.invalidateSession(session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	}
};

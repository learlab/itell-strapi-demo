"use server";
import { cookies } from "next/headers";
import { getSession, lucia } from ".";

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

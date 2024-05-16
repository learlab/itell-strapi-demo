import { env } from "@/env.mjs";
import { lucia } from "@/lib/auth";
import { googleProvider } from "@/lib/auth/google";
import db from "@/lib/db";
import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { readGoogleOAuthState } from "../state";

type GoogleUser = {
	id: string;
	name: string;
	picture: string;
	email: string;
};

export async function GET(req: Request) {
	const url = new URL(req.url);
	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");
	const { state: storedState, codeVerifier: storedCodeVerifier } =
		readGoogleOAuthState();

	if (
		!code ||
		!state ||
		!storedState ||
		!storedCodeVerifier ||
		state !== storedState
	) {
		return notFound();
	}

	try {
		const { accessToken } = await googleProvider.validateAuthorizationCode(
			code,
			storedCodeVerifier,
		);
		const googleUserResponse = await fetch(
			"https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);
		const googleUser = (await googleUserResponse.json()) as GoogleUser;

		let user = await db.user.findFirst({
			where: {
				name: googleUser.name,
			},
		});

		if (!user) {
			user = await db.user.create({
				data: {
					name: googleUser.name,
					image: googleUser.picture,
					email: googleUser.email,
					role: env.ADMINS?.includes(googleUser.email) ? "admin" : "user",
				},
			});
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	} catch (error) {
		Sentry.captureMessage("google oauth error", {
			extra: {
				msg: JSON.stringify(error),
			},
		});
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/auth?error=google_oauth",
			},
		});
	}
}

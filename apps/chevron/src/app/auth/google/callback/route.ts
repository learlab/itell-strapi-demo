import { env } from "@/env.mjs";
import { lucia } from "@/lib/auth";
import { googleProvider, readGoogleOAuthState } from "@/lib/auth/provider";
import { Condition } from "@/lib/control/condition";
import { createUserTx, getUserByProvider } from "@/lib/user/actions";
import { reportSentry } from "@/lib/utils";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

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
		const tokens = await googleProvider.validateAuthorizationCode(
			code,
			storedCodeVerifier,
		);
		const accessToken = tokens.accessToken();
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

		let user = await getUserByProvider({
			provider_id: "google",
			provider_user_id: googleUser.id,
		});

		if (!user) {
			user = await createUserTx({
				user: {
					name: googleUser.name,
					image: googleUser.picture,
					email: googleUser.email,
					condition: Condition.STAIRS,
					role: env.ADMINS?.includes(googleUser.email) ? "admin" : "user",
				},
				provider_id: "google",
				provider_user_id: googleUser.id,
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
		console.log("google oauth error", error);
		reportSentry("google oauth error", { error });
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/auth?error=oauth",
			},
		});
	}
}

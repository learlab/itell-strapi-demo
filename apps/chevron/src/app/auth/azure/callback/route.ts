import { env } from "@/env.mjs";
import { lucia } from "@/lib/auth";
import { azureProvider, readAzureOAuthState } from "@/lib/auth/provider";
import { Condition } from "@/lib/control/condition";
import { createUserTx, getUserByProvider } from "@/lib/user/actions";
import { reportSentry } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type AzureUser = {
	oid: string;
	preferred_username: string;
	name: string;
	email?: string;
};

export const GET = async (req: Request) => {
	const url = new URL(req.url);
	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");
	const { state: storedState, codeVerifier: storedCodeVerifier } =
		readAzureOAuthState();

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
		const tokens = await azureProvider.validateAuthorizationCode(
			code,
			storedCodeVerifier,
		);
		const idToken = tokens.idToken();
		const azureUser = jwtDecode(idToken) as AzureUser;

		let user = await getUserByProvider({
			provider_id: "azure",
			provider_user_id: azureUser.oid,
		});

		if (!user) {
			user = await createUserTx({
				user: {
					name: azureUser.name || azureUser.preferred_username,
					email: azureUser.email,
					condition: Condition.STAIRS,
					role: env.ADMINS?.includes(azureUser.email || "") ? "admin" : "user",
				},
				provider_id: "azure",
				provider_user_id: azureUser.oid,
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
		console.log("azure oauth error", error);
		reportSentry("azure oauth error", { error });
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/auth?error=oauth",
			},
		});
	}
};

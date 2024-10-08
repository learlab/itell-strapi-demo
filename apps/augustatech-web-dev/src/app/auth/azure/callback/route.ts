import { createUserAction, getUserByProviderAction } from "@/actions/user";
import { env } from "@/env.mjs";
import { lucia } from "@/lib/auth/lucia";
import {
	azureProvider,
	readAzureOAuthState,
	readJoinClassCode,
} from "@/lib/auth/provider";
import { Condition } from "@/lib/constants";
import { reportSentry } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import { generateIdFromEntropySize } from "lucia";
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

	const join_class_code = readJoinClassCode();
	const {
		state: storedState,
		codeVerifier: storedCodeVerifier,
		referer,
	} = readAzureOAuthState();

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

		if (azureUser.email) {
			const emailLower = azureUser.email.toLocaleLowerCase();
			if (
				!emailLower.endsWith("vanderbilt.edu") &&
				!emailLower.endsWith("augustatech.edu")
			) {
				return new Response(null, {
					status: 302,
					headers: {
						Location: "/auth?error=wrong_email",
					},
				});
			}
		}

		let [user, err] = await getUserByProviderAction({
			provider_id: "azure",
			provider_user_id: azureUser.oid,
		});
		if (err) {
			throw new Error(err?.message);
		}

		if (!user) {
			const [newUser, err] = await createUserAction({
				user: {
					id: generateIdFromEntropySize(16),
					name: azureUser.name || azureUser.preferred_username,
					email: azureUser.email,
					condition: Condition.STAIRS,
					role: env.ADMINS?.includes(azureUser.email || "") ? "admin" : "user",
				},
				provider_id: "azure",
				provider_user_id: azureUser.oid,
			});
			if (err) {
				throw new Error(err?.message);
			}

			user = newUser;
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
		if (join_class_code !== null) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: `/dashboard/settings?join_class_code=${join_class_code}`,
				},
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: referer ?? "/",
			},
		});
	} catch (error) {
		reportSentry("azure oauth error", { error });
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/auth?error=oauth",
			},
		});
	}
};

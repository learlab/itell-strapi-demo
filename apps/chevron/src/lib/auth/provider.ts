import { env } from "@/env.mjs";
import {
	Google,
	MicrosoftEntraId,
	generateCodeVerifier,
	generateState,
} from "arctic";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export type OAuthProvider = "google" | "azure";

export const azureProvider = new MicrosoftEntraId(
	env.AZURE_TENANT_ID,
	env.AZURE_CLIENT_ID,
	env.AZURE_CLIENT_SECRET,
	`${env.HOST}/auth/azure/callback`,
);

export const googleProvider = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	`${env.HOST}/auth/google/callback`,
);

const cookieOptions: Partial<ResponseCookie> = {
	path: "/",
	secure: process.env.NODE_ENV === "production",
	httpOnly: true,
	maxAge: 60 * 10,
	sameSite: "lax",
};

export const setAzureOAuthState = () => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	cookies().set("azure_oauth_state", state, cookieOptions);
	cookies().set("azure_oauth_code_verifier", codeVerifier, cookieOptions);

	return { state, codeVerifier };
};

export const readAzureOAuthState = () => {
	const state = cookies().get("azure_oauth_state")?.value ?? null;
	const codeVerifier =
		cookies().get("azure_oauth_code_verifier")?.value ?? null;

	return { state, codeVerifier };
};

export const setGoogleOAuthState = () => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	cookies().set("google_oauth_state", state, cookieOptions);
	cookies().set("google_oauth_code_verifier", codeVerifier, cookieOptions);

	return { state, codeVerifier };
};

export const readGoogleOAuthState = () => {
	const state = cookies().get("google_oauth_state")?.value ?? null;
	const codeVerifier =
		cookies().get("google_oauth_code_verifier")?.value ?? null;

	return { state, codeVerifier };
};

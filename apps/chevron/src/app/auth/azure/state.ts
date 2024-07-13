import { generateCodeVerifier, generateState } from "arctic";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

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

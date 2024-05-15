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

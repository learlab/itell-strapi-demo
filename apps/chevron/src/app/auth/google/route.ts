import { googleProvider } from "@/lib/auth/google";
import { setGoogleOAuthState } from "./state";

export async function GET(): Promise<Response> {
	const { state, codeVerifier } = setGoogleOAuthState();
	const url = googleProvider.createAuthorizationURL(state, codeVerifier);
	url.addScopes("openid", "profile", "email");
	return Response.redirect(url);
}

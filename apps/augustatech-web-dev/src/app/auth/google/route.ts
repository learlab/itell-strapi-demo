import { googleProvider, setGoogleOAuthState } from "@/lib/auth/provider";

export async function GET(): Promise<Response> {
	const { state, codeVerifier } = setGoogleOAuthState();
	const url = googleProvider.createAuthorizationURL(state, codeVerifier);
	url.addScopes("openid", "profile", "email");
	return Response.redirect(url);
}

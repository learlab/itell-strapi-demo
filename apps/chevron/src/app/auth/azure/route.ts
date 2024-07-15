import { azureProvider, setAzureOAuthState } from "@/lib/auth/provider";

export async function GET(): Promise<Response> {
	const { state, codeVerifier } = setAzureOAuthState();
	const url = azureProvider.createAuthorizationURL(state, codeVerifier);

	url.addScopes("openid", "profile", "email", "user.read");
	url.searchParams.set("nonce", "_");

	return Response.redirect(url);
}

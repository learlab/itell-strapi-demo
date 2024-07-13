import { azureProvider } from "@/lib/auth/azure";
import { setAzureOAuthState } from "./state";

export async function GET(): Promise<Response> {
	const { state, codeVerifier } = setAzureOAuthState();
	const url = azureProvider.createAuthorizationURL(state, codeVerifier);

	url.addScopes("openid", "profile", "email");
	url.searchParams.set("nonce", "_");

	return Response.redirect(url);
}

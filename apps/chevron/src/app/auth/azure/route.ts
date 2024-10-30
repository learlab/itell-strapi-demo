import {
  azureProvider,
  setAzureOAuthState,
  setJoinClassCode,
} from "@/lib/auth/provider";

export async function GET(req: Request): Promise<Response> {
  const searchParams = new URL(req.url).searchParams;
  const referer = req.headers.get("referer");
  const { state, codeVerifier } = setAzureOAuthState(
    referer && !referer.endsWith("/auth") ? referer : undefined
  );
  setJoinClassCode(searchParams.get("join_class_code"));

  const url = azureProvider.createAuthorizationURL(state, codeVerifier);
  url.addScopes("openid", "profile", "email", "user.read");
  url.searchParams.set("nonce", "_");

  return Response.redirect(url);
}

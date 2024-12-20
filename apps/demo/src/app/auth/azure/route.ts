import {
  azureProvider,
  setAuthData,
  setAzureOAuthState,
} from "@/lib/auth/provider";

export async function GET(req: Request): Promise<Response> {
  const searchParams = new URL(req.url).searchParams;
  const referrerHeader = req.headers.get("referer");
  const dst =
    searchParams.get("redirect_to") ??
    (referrerHeader && referrerHeader !== "/auth" ? referrerHeader : "/");
  const { state, codeVerifier } = await setAzureOAuthState();
  const join_class_code = searchParams.get("join_class_code") ?? "";
  await setAuthData({ dst, join_class_code });

  const url = azureProvider.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
    "user.read",
  ]);
  url.searchParams.set("nonce", "_");

  return Response.redirect(url);
}

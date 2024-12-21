import {
  googleProvider,
  setAuthData,
  setGoogleOAuthState,
} from "@/lib/auth/provider";

export async function GET(req: Request): Promise<Response> {
  const searchParams = new URL(req.url).searchParams;
  const referrerHeader = req.headers.get("referer");
  const dst =
    searchParams.get("redirect_to") ??
    (referrerHeader && !referrerHeader.endsWith("/auth")
      ? referrerHeader
      : "/");
  const { state, codeVerifier } = await setGoogleOAuthState();
  const join_class_code = searchParams.get("join_class_code") ?? "";
  await setAuthData({ dst, join_class_code });

  const url = googleProvider.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  return Response.redirect(url);
}

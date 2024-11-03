import {
  googleProvider,
  setGoogleOAuthState,
  setJoinClassCode,
} from "@/lib/auth/provider";

export async function GET(req: Request): Promise<Response> {
  const searchParams = new URL(req.url).searchParams;
  const referer = req.headers.get("referer");
  const { state, codeVerifier } = await setGoogleOAuthState(
    referer && !referer.endsWith("/auth") ? referer : undefined
  );
  await setJoinClassCode(searchParams.get("join_class_code"));

  const url = googleProvider.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  return Response.redirect(url);
}

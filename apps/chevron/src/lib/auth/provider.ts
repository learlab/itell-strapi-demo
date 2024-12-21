import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import {
  generateCodeVerifier,
  generateState,
  Google,
  MicrosoftEntraId,
} from "arctic";

import { env } from "@/env.mjs";
import { isProduction } from "../constants";

export type OAuthProvider = "google" | "azure";

export const azureProvider = new MicrosoftEntraId(
  env.AZURE_TENANT_ID,
  env.AZURE_CLIENT_ID,
  env.AZURE_CLIENT_SECRET,
  `${env.NEXT_PUBLIC_HOST}/auth/azure/callback`
);

export const googleProvider = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.NEXT_PUBLIC_HOST}/auth/google/callback`
);

const cookieOptions: Partial<ResponseCookie> = {
  path: "/",
  secure: isProduction,
  httpOnly: true,
  maxAge: 60 * 10,
  sameSite: "lax",
};

export const setJoinClassCode = async (join_class_code: string | null) => {
  if (join_class_code !== null) {
    (await cookies()).set("join_class_code", join_class_code);
  }
};

export const readJoinClassCode = async () => {
  const c = await cookies();

  const join_class_code = c.get("join_class_code")?.value ?? null;

  // eslint-disable-next-line drizzle/enforce-delete-with-where
  c.delete("join_class_code");

  return join_class_code;
};

export const setAzureOAuthState = async (referer?: string) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const c = await cookies();

  c.set("azure_oauth_state", state, cookieOptions);
  c.set("azure_oauth_code_verifier", codeVerifier, cookieOptions);
  if (referer) {
    c.set("azure_oauth_referer", referer, cookieOptions);
  }

  return { state, codeVerifier };
};

export const readAzureOAuthState = async () => {
  const c = await cookies();
  const state = c.get("azure_oauth_state")?.value ?? null;
  const codeVerifier = c.get("azure_oauth_code_verifier")?.value ?? null;
  const referer = c.get("azure_oauth_referer")?.value ?? null;

  return { state, codeVerifier, referer };
};

export const setGoogleOAuthState = async (referer?: string) => {
  const c = await cookies();

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  c.set("google_oauth_state", state, cookieOptions);
  c.set("google_oauth_code_verifier", codeVerifier, cookieOptions);
  if (referer) {
    c.set("google_oauth_referer", referer, cookieOptions);
  }

  return { state, codeVerifier };
};

export const readGoogleOAuthState = async () => {
  const c = await cookies();

  const state = c.get("google_oauth_state")?.value ?? null;
  const codeVerifier = c.get("google_oauth_code_verifier")?.value ?? null;
  const referer = c.get("google_oauth_referer")?.value ?? null;
  return { state, codeVerifier, referer };
};

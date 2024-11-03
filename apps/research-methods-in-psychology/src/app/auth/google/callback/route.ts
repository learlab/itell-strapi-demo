import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";

import { createUserAction, getUserByProviderAction } from "@/actions/user";
import { env } from "@/env.mjs";
import { getPageConditions } from "@/lib/auth/conditions";
import { lucia } from "@/lib/auth/lucia";
import {
  googleProvider,
  readGoogleOAuthState,
  readJoinClassCode,
} from "@/lib/auth/provider";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { reportSentry } from "@/lib/utils";

type GoogleUser = {
  id: string;
  name: string;
  picture: string;
  email: string;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");

  if (err === "access_denied") {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/auth?error=access_denied",
      },
    });
  }

  const {
    state: storedState,
    codeVerifier: storedCodeVerifier,
    referer,
  } = readGoogleOAuthState();
  const join_class_code = readJoinClassCode();

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return notFound();
  }

  try {
    const tokens = await googleProvider.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    console.log("tokens", tokens);
    const accessToken = tokens.accessToken();
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("googleUserResponse", googleUserResponse);
    const googleUser = (await googleUserResponse.json()) as GoogleUser;

    let [user, err] = await getUserByProviderAction({
      provider_id: "google",
      provider_user_id: googleUser.id,
    });
    if (err) {
      throw new Error(err.message);
    }

    if (!user) {
      const pageConditions = getPageConditions(allPagesSorted);
      const [newUser, err] = await createUserAction({
        user: {
          id: generateIdFromEntropySize(16),
          name: googleUser.name,
          image: googleUser.picture,
          email: googleUser.email,
          conditionAssignments: pageConditions,
          role: env.ADMINS?.includes(googleUser.email) ? "admin" : "user",
        },
        provider_id: "google",
        provider_user_id: googleUser.id,
      });
      if (err) {
        throw new Error(err.message);
      }

      user = newUser;
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    if (join_class_code !== null) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/dashboard/settings?join_class_code=${join_class_code}`,
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: referer ?? "/",
      },
    });
  } catch (error) {
    reportSentry("google oauth error", { error });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/auth?error=oauth",
      },
    });
  }
}

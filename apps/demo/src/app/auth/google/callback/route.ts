import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";

import { getTeacherByClassAction } from "@/actions/dashboard";
import {
  createUserAction,
  getUserByProviderAction,
  updateUserAction,
} from "@/actions/user";
import { env } from "@/env.mjs";
import { getPageConditions } from "@/lib/auth/conditions";
import { lucia } from "@/lib/auth/lucia";
import {
  googleProvider,
  readAuthData,
  readGoogleOAuthState,
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

  const { state: storedState, codeVerifier: storedCodeVerifier } =
    await readGoogleOAuthState();
  const { dst, join_class_code } = await readAuthData();

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
    const googleUser = (await googleUserResponse.json()) as GoogleUser;
    // eslint-disable-next-line
    let [user, err] = await getUserByProviderAction({
      provider_id: "google",
      provider_user_id: googleUser.id,
    });
    if (err) {
      throw new Error(err.message, { cause: err });
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
          // new users are enrolled in class if the class code is valid (check in createUserAction), pass undefined if it is null or empty string
          classId: join_class_code || undefined,
        },
        provider_id: "google",
        provider_user_id: googleUser.id,
      });
      if (err) {
        throw new Error(err.message, { cause: err });
      }

      user = newUser;
    } else {
      // for existing users without a class id, update their record
      if (
        user.classId === null &&
        join_class_code !== null &&
        join_class_code !== ""
      ) {
        const [teacher, err] = await getTeacherByClassAction({
          classId: join_class_code,
        });
        if (err) {
          throw new Error(err.message, { cause: err });
        }

        if (teacher) {
          updateUserAction({ id: user.id, classId: join_class_code });
        }
      }
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // redirect users to consent form if it is untouched
    if (user.consentGiven === null) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/consent",
        },
      });
    }

    // redirect to dst, which can be
    // - the "redirect_to" searchParam present on the /auth page
    // - referrer header
    // - homepage (fallback)
    return new Response(null, {
      status: 303,
      headers: {
        Location: dst ?? "/",
      },
    });
  } catch (error) {
    reportSentry("google oauth error", { error });
    const url = new URL("/auth", env.NEXT_PUBLIC_HOST);
    url.searchParams.append("error", "oauth");
    return Response.redirect(url.toString());
  }
}

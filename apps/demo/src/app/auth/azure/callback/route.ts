import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { decodeIdToken } from "arctic";
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
  azureProvider,
  readAuthData,
  readAzureOAuthState,
} from "@/lib/auth/provider";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { reportSentry } from "@/lib/utils";

type AzureUser = {
  oid: string;
  preferred_username: string;
  name: string;
  email?: string;
};

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  const { state: storedState, codeVerifier: storedCodeVerifier } =
    await readAzureOAuthState();
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
    const tokens = await azureProvider.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const idToken = tokens.idToken();
    const azureUser = decodeIdToken(idToken) as AzureUser;

    // if (azureUser.email) {
    //   const emailLower = azureUser.email.toLocaleLowerCase();
    //   if (
    //     !emailLower.endsWith("vanderbilt.edu") &&
    //     !emailLower.endsWith("mga.edu")
    //   ) {
    //     return new Response(null, {
    //       status: 302,
    //       headers: {
    //         Location: "/auth?error=wrong_email",
    //       },
    //     });
    //   }
    // }

    let [user, err] = await getUserByProviderAction({
      provider_id: "azure",
      provider_user_id: azureUser.oid,
    });
    if (err) {
      throw new Error(err.message, { cause: err });
    }

    if (!user) {
      const pageConditions = getPageConditions(allPagesSorted);
      const [newUser, err] = await createUserAction({
        user: {
          id: generateIdFromEntropySize(16),
          name: azureUser.name || azureUser.preferred_username,
          email: azureUser.email,
          conditionAssignments: pageConditions,
          role: env.ADMINS?.includes(azureUser.email ?? "") ? "admin" : "user",
          // new users are enrolled in class if the class code is valid (check in createUserAction), pass undefined if it is null or empty string
          classId: join_class_code || undefined,
        },
        provider_id: "azure",
        provider_user_id: azureUser.oid,
      });
      if (err) {
        throw new Error(err.message);
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
    // - the "redirect_to" searchParam in the /auth page
    // - referrer header
    // - homepage (fallback)
    return new Response(null, {
      status: 303,
      headers: {
        Location: dst ?? "/",
      },
    });
  } catch (error) {
    reportSentry("azure oauth error", { error });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/auth?error=oauth",
      },
    });
  }
};

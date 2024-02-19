import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions, getServerSession } from "next-auth";
import { getServerSession as getServerSessionNext } from "next-auth/next";
import AzureADProvider from "next-auth/providers/azure-ad";

import db from "./db";
import { env } from "@/env.mjs";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		AzureADProvider({
			clientId: env.AZURE_CLIENT_ID,
			clientSecret: env.AZURE_CLIENT_SECRET,
			tenantId: "common",
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
				if (session.user.email) {
					const classOneEmails = (env.CLASS_ONE_EMAILS as string[]) || [];
					const classTwoEmails = (env.CLASS_TWO_EMAILS as string[]) || [];

					if (classOneEmails.includes(session.user.email)) {
						session.user.class = "one";
					} else if (classTwoEmails.includes(session.user.email)) {
						session.user.class = "two";
					} else {
						session.user.class = undefined;
					}
				}
			}
			return session;
		},
	},
	cookies: {
		csrfToken: {
			name: "next-auth.csrf-token",
			options: {
				httpOnly: true,
				sameSite: "none",
				path: "/",
				secure: true,
			},
		},
		pkceCodeVerifier: {
			name: "next-auth.pkce.code_verifier",
			options: {
				httpOnly: true,
				sameSite: "none",
				path: "/",
				secure: true,
			},
		},
	},
	pages: {
		signIn: "/auth",
		error: "/auth",
	},
};

export const getApiAuthSession = async ({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}) => {
	return await getServerSession(req, res, authOptions);
};

export const getServerAuthSession = async () => {
	return await getServerSessionNext(authOptions);
};

export async function getCurrentUser() {
	const session = await getServerSession(authOptions);

	return session?.user;
}

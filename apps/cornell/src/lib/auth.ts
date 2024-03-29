import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions, getServerSession } from "next-auth";
import { getServerSession as getServerSessionNext } from "next-auth/next";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env.mjs";
import db from "./db";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			id: "google",
			name: "google",
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
		AzureADProvider({
			id: "azure-ad",
			name: "Azure AD",
			clientId: env.AZURE_CLIENT_ID,
			clientSecret: env.AZURE_CLIENT_SECRET,
			tenantId: "common",
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
		signIn: async ({ user }) => {
			if (env.ADMINS?.includes(user.email || "")) {
				return true;
			}

			if (env.STUDENTS?.includes(user.email || "")) {
				return true;
			}

			return "/auth?error=InvalidEmail";
		},
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
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
export type SessionUser = Awaited<ReturnType<typeof getCurrentUser>>;

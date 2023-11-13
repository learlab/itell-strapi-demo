import { env } from "@/env.mjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
		AzureADProvider({
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
		session({ session, user, token }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
		redirect: async ({ url, baseUrl }) => {
			const suffix = url.endsWith("?auth-redirect=true")
				? ""
				: "?auth-redirect=true";
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}${suffix}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return `${url}${suffix}`;
			return `${baseUrl}${suffix}`;
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

export default NextAuth(authOptions);

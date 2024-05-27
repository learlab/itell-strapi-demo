import { env } from "@/env.mjs";
import { Google } from "arctic";

console.log(`${env.NEXTAUTH_URL}/auth/google/callback`);
export const googleProvider = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	`${env.NEXTAUTH_URL}/auth/google/callback`,
);

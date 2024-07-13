import { env } from "@/env.mjs";
import { MicrosoftEntraId } from "arctic";

export const azureProvider = new MicrosoftEntraId(
	env.AZURE_TENANT_ID,
	env.AZURE_CLIENT_ID,
	env.AZURE_CLIENT_SECRET,
	`${env.NEXTAUTH_URL}/auth/azure/callback`,
);

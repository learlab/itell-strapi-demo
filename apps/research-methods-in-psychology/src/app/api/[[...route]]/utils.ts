import { env } from "@/env.mjs";
import { createFetchWithBearerToken } from "@itell/utils";

export const ifetch = createFetchWithBearerToken(env.ITELL_API_KEY || "");

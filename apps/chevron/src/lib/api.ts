import { env } from "@/env.mjs";
import { createFetchWithBearerToken } from "@itell/core/itellFetch";

export const ifetch = createFetchWithBearerToken(env.ITELL_API_KEY || "");

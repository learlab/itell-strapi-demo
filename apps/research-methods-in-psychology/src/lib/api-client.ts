import { env } from "@/env.mjs";
import { createApiClient } from "@itell/api";
export const apiClient = createApiClient(env.NEXT_PUBLIC_HOST);

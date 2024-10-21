import { createApiClient } from "@itell/api";

import { env } from "@/env.mjs";

export const apiClient = createApiClient(env.NEXT_PUBLIC_HOST);

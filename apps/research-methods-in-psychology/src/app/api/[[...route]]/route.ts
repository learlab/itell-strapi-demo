import { env } from "@/env.mjs";
import { createApp } from "@itell/api";
import { createFetchWithBearerToken } from "@itell/utils";
import { handle } from "hono/vercel";

export const dynamic = "force-dynamic";

const app = createApp({
  apiUrl: env.NEXT_PUBLIC_API_URL,
  fetcher: createFetchWithBearerToken(env.ITELL_API_KEY || ""),
});

export const GET = handle(app);
export const POST = handle(app);

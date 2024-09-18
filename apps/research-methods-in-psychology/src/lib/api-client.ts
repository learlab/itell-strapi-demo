import { ApiType } from "@/app/api/[[...route]]/route";
import { env } from "@/env.mjs";
import { hc } from "hono/client";
export const apiClient = hc<ApiType>(env.NEXT_PUBLIC_HOST);

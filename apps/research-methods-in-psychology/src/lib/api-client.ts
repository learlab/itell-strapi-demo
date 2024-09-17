import { AppType } from "@/app/api/[[...route]]/route";
import { env } from "@/env.mjs";
import { hc } from "hono/client";

export const client = hc<AppType>("http://localhost:3001");

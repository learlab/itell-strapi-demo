import { hc } from "hono/client";
import { createApp } from "./app.js";

type App = ReturnType<typeof createApp>;
const client = hc<App>("");
export type Client = typeof client;

export const createApiClient = (...args: Parameters<typeof hc>): Client =>
	hc<App>(...args);

export { createApp };

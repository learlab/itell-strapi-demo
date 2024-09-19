import { Hono } from "hono";
import { handle } from "hono/vercel";
import { chat } from "./chat";
import { cri } from "./cri";
import { summary } from "./summary";

export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api");

const routes = app
	.route("/cri", cri)
	.route("/chat", chat)
	.route("/summary", summary);

export type ApiType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);

import { Hono } from "hono";
import { createChatRouter } from "./chat.js";
import { createCriRouter } from "./cri.js";
import { createSummaryRouter } from "./summary.js";

export const createApp = ({
	fetcher,
	apiUrl,
}: { fetcher: typeof fetch; apiUrl: string }) => {
	return new Hono()
		.basePath("/api")
		.route("/summary", createSummaryRouter({ fetcher, apiUrl }))
		.route("/chat", createChatRouter({ fetcher, apiUrl }))
		.route("/cri", createCriRouter({ fetcher, apiUrl }));
};

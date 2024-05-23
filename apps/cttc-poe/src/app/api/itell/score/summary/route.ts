import { ifetch } from "@/lib/api";
import { env } from "@/env.mjs";
import type { ChatHistory } from "@itell/core/dist/chatbot/schema";
import type { FocusTime } from "@prisma/client";

interface Data {
	summary: string;
	page_slug: string;
}

export async function POST(req: Request) {
	const data: Data = (await req.json()) as Data;

	const requestBody = JSON.stringify({
		summary: data.summary,
		page_slug: data.page_slug,
	});
	const response = await ifetch(`${env.NEXT_PUBLIC_API_URL}/score/summary`, {
		method: "POST",
		body: requestBody,
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		return new Response(response.body);
	}
	return new Response("Failed to fetch response", { status: 500 });
}

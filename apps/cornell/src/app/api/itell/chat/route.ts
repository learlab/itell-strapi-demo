import { fetchChatResponse } from "@itell/core/chatbot";
import type { ChatHistory } from "@itell/core/dist/chatbot/schema";
import { env } from "@/env.mjs";

interface Data {
	pageSlug: string;
	text: string;
	history?: ChatHistory;
}

export async function POST(req: Request) {
	const data: Data = (await req.json()) as Data;
	const response = await fetchChatResponse(
		`${env.NEXT_PUBLIC_API_URL}/chat`,
		data,
		env.ITELL_API_KEY || "",
	);
	if (response.ok) {
		return new Response(response.data);
	}
	return new Response("Failed to fetch chat response", { status: 500 });
}

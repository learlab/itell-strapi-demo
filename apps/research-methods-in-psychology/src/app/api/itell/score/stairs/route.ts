import { FocusTimeData } from "@/drizzle/schema";
import { env } from "@/env.mjs";
import { ifetch } from "@/lib/api";
import type { ChatHistory } from "@itell/core/dist/chatbot/schema";

interface Data {
	summary: string;
	page_slug: string;
	focus_time: FocusTimeData;
	chat_history: ChatHistory;
	excluded_chunks: string[];
}

export async function POST(req: Request) {
	const data: Data = (await req.json()) as Data;

	const requestBody = JSON.stringify({
		summary: data.summary,
		page_slug: data.page_slug,
		focus_time: data.focus_time,
		chat_history: data.chat_history,
		excluded_chunks: data.excluded_chunks,
	});
	const response = await ifetch(
		`${env.NEXT_PUBLIC_API_URL}/score/summary/stairs`,
		{
			method: "POST",
			body: requestBody,
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	if (response.ok) {
		return new Response(response.body);
	}
	return new Response(await response.text(), { status: 500 });
}

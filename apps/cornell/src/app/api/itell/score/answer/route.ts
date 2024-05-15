import { env } from "@/env.mjs";

interface Data {
	pageSlug: string;
	chunkSlug: string;
	answer: string;
}

export async function POST(req: Request) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("API_Key", env.ITELL_API_KEY || "");

	const data: Data = (await req.json()) as Data;

	const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/score/answer`, {
		method: "POST",
		body: JSON.stringify({
			page_slug: data.pageSlug,
			chunk_slug: data.chunkSlug,
			answer: data.answer,
		}),
		headers,
	});

	if (response.ok) {
		return new Response(response.body);
	}
	return new Response("Failed to fetch answer response", { status: 500 });
}

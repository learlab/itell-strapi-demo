import { env } from "@/env.mjs";
import { createFetchWithBearerToken } from "@itell/core/itellFetch";

interface Data {
	pageSlug: string;
	chunkSlug: string;
	answer: string;
}

export async function POST(req: Request) {
	const ifetch = createFetchWithBearerToken(env.ITELL_API_KEY || "");

	const data: Data = (await req.json()) as Data;

	const response = await ifetch(`${env.NEXT_PUBLIC_API_URL}/score/answer`, {
		method: "POST",
		body: JSON.stringify({
			page_slug: data.pageSlug,
			chunk_slug: data.chunkSlug,
			answer: data.answer,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		return new Response(response.body);
	}
	return new Response("Failed to fetch answer response", { status: 500 });
}

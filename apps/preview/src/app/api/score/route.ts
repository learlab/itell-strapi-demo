import { createFetchWithBearerToken } from "@itell/utils";
const ifetch = createFetchWithBearerToken(process.env.ITELL_API_KEY || "");

interface Data {
	pageSlug: string;
	chunkSlug: string;
	answer: string;
}

export async function POST(req: Request) {
	const data = (await req.json()) as Data;
	const response = await ifetch(`${process.env.ITELL_API_URL}/score/answer`, {
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

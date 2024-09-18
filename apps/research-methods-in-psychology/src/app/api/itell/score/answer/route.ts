import { env } from "@/env.mjs";
import { ifetch } from "@/lib/api";

interface Data {
	pageSlug: string;
	chunkSlug: string;
	answer: string;
}

export async function POST(req: Request) {
	const data = (await req.json()) as Data;

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
	return new Response(response.body, {
		status: response.status,
	});
}

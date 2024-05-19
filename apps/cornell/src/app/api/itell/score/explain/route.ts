import { env } from "@/env.mjs";
import { createFetchWithBearerToken } from "@itell/core/itellFetch";

interface Data {
	pageSlug: string;
	chunkSlug: string;
	studentResponse: string;
}

export async function POST(req: Request) {
	const ifetch = createFetchWithBearerToken(env.ITELL_API_KEY || "");

	const data: Data = (await req.json()) as Data;
	const response = await ifetch(`${env.NEXT_PUBLIC_API_URL}/chat/CRI`, {
		method: "POST",
		body: JSON.stringify({
			page_slug: data.pageSlug,
			chunk_slug: data.chunkSlug,
			student_response: data.studentResponse,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		return new Response(response.body);
	}
	return Response.json({ error: "Failed to fetch response" });
}

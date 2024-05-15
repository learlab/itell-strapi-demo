import { env } from "@/env.mjs";

interface Data {
	pageSlug: string;
	chunkSlug: string;
	studentResponse: string;
}

export async function POST(req: Request) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("API_Key", env.ITELL_API_KEY || "");

	const data: Data = (await req.json()) as Data;
	const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/chat/CRI`, {
		method: "POST",
		body: JSON.stringify({
			page_slug: data.pageSlug,
			chunk_slug: data.chunkSlug,
			student_response: data.studentResponse,
		}),
		headers,
	});

	if (response.ok) {
		return new Response(response.body);
	}
	return Response.json({ error: "Failed to fetch response" });
}

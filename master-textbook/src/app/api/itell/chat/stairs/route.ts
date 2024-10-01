import { env } from "@/env.mjs";
import { ifetch } from "@/lib/api";

export async function POST(req: Request) {
	const response = await ifetch(`${env.NEXT_PUBLIC_API_URL}/chat/SERT`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: await req.text(),
	});
	if (response.ok) {
		return response;
	}
	return new Response("Failed to fetch chat response", { status: 500 });
}

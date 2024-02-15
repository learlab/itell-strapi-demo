import { ChatResponse, ChatResponseSchema } from "./schema";
export * from "./schema";

export const fetchChatResponse = async ({
	pageSlug,
	text,
	endpoint,
}: {
	pageSlug: string;
	text: string;
	endpoint: string;
}): Promise<ChatResponse> => {
	const response = await fetch(endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ page_slug: pageSlug, message: text }),
	});
	const parsed = ChatResponseSchema.safeParse(response);
	if (!parsed.success || !parsed.data.ok) {
		return {
			data: null,
			ok: false,
		};
	}

	return {
		ok: true,
		data: parsed.data.body as ReadableStream,
	};
};

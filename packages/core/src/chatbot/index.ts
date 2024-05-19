import { ChatHistory, ChatResponse, ChatResponseSchema } from "./schema";
export * from "./schema";
import { createFetchWithBearerToken } from "@/itellFetch";

type ChatRequestBody = {
	pageSlug: string;
	text: string;
	history?: ChatHistory;
};

export const fetchChatResponse = async (
	endpoint: string,
	{ pageSlug, text, history }: ChatRequestBody,
	apiKey: string
): Promise<ChatResponse> => {
	const ifetch = createFetchWithBearerToken(apiKey);

	const response = await ifetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ page_slug: pageSlug, message: text, history }),
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

import { z } from "zod";

export const MessageSchema = z.object({
	id: z.string(),
	text: z.string(),
	isUserMessage: z.boolean(),
});

export type Message = z.infer<typeof MessageSchema>;
export const MessageArraySchema = z.array(MessageSchema);

const ApiResponseSchema = z.object({
	ok: z.boolean(),
	body: z.any(),
});

export const ChunkSchema = z.object({
	request_id: z.string(),
	text: z.string(),
});

type ChatResponse =
	| {
			ok: false;
			data: null;
	  }
	| { ok: true; data: ReadableStream };

export const fetchChatResponse = async ({
	pageSlug,
	text,
}: { pageSlug: string; text: string }): Promise<ChatResponse> => {
	const response = await fetch(
		"https://itell-api.learlab.vanderbilt.edu/chat",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ page_slug: pageSlug, message: text }),
		},
	);
	const parsed = ApiResponseSchema.safeParse(response);
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

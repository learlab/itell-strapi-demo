import { z } from "zod";

export type Message =
	| {
			id: string;
			isUserMessage: boolean;
			isChunkQuestion: boolean;
			text: string;
	  }
	| {
			id: string;
			isUserMessage: boolean;
			isChunkQuestion: boolean;
			Element: () => JSX.Element;
	  };

export type Messages = Message[];

export const ChatResponseSchema = z.object({
	ok: z.boolean(),
	body: z.any(),
});

export const ChunkSchema = z.object({
	request_id: z.string(),
	text: z.string(),
});

export type ChatResponse =
	| {
			ok: false;
			data: null;
	  }
	| { ok: true; data: ReadableStream };

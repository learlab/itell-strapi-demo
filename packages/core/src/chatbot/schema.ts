import { z } from "zod";

export type UserMessage = {
	id: string;
	isUser: true;
	isChunkQuestion: boolean;
	text: string;
};
export type BotMessage =
	| {
			id: string;
			isUser: false;
			isChunkQuestion: boolean;
			text: string;
	  }
	| {
			id: string;
			isUser: false;
			isChunkQuestion: boolean;
			Element: () => JSX.Element;
	  };

export type Message = UserMessage | BotMessage;

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

import { z } from "zod";

export type ChatHistoryItem = { agent: "user" | "bot"; text: string };
export type ChatHistory = ChatHistoryItem[];

export type UserMessage = {
	id: string;
	isUser: true;
	text: string;
};
export type BotMessage =
	| {
			id: string;
			isUser: false;
			text: string;
			context?: string;
	  }
	| {
			id: string;
			isUser: false;
			context?: string;
			Node: React.ReactNode;
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

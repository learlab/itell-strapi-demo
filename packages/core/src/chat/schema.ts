import { z } from "zod";

export type ChatHistoryItem = { agent: "user" | "bot"; text: string };
export type ChatHistory = ChatHistoryItem[];

export type Message = {
  id: string;
  isUser: boolean;
  text: string;
  transform?: boolean;
  context?: string;
  node?: React.ReactNode;
};
export type UserMessage = Message & { isUser: true };
export type BotMessage = Message & { isUser: false };

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

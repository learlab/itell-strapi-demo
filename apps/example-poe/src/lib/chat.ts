import { z } from "zod";

export const MessageSchema = z.object({
	id: z.string(),
	text: z.string(),
	isUserMessage: z.boolean(),
});

export const MessageArraySchema = z.array(MessageSchema);

export type Message = z.infer<typeof MessageSchema>;

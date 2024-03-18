import { ChatMessages } from "@/components/chat/chat-messages";
import type { ChatMessage } from "@prisma/client";

declare global {
	namespace PrismaJson {
		// you can use classes, interfaces, types, etc.
		type ChatMessageData = {
			text: string;
			isUser: boolean;
		};

		type FocusTimeData = Record<string, number>;
	}
}

const m: ChatMessage = {};

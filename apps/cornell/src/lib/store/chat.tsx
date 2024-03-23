import { ChunkQuestionReadyStairs } from "@/components/chat/chunk-question-button";
import { BotMessage, ChatHistory, Message } from "@itell/core/chatbot";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ChatProps {
	messages: Message[];
	activeMessageId: string | null;
	chunkQuestionAnswered: boolean;
	chunkQuestionReady: boolean;
	chunkQuestionText: string | null;
	chunkQuestionMessages: Message[];
}

interface ChatState extends ChatProps {
	addUserMessage: (text: string, isChunkQuestion?: boolean) => string;
	addBotMessage: (text: string, isChunkQuestion?: boolean) => string;
	addBotMessageElement: (comp: () => JSX.Element) => void;
	updateBotMessage: (
		id: string,
		text: string,
		isChunkQuestion?: boolean,
	) => void;
	setActiveMessageId: (id: string | null) => void;
	setChunkQuestionAnswered: (value: boolean) => void;
	addChunkQuestionStairs: (value: string) => void;
	syncMessages: () => Promise<void>;
}

const welcomeMessage: BotMessage = {
	id: crypto.randomUUID(),
	text: "Hello, how can I help you?",
	isUser: false,
};

export const useChatStore = create(
	immer<ChatState>((set, get) => ({
		messages: [welcomeMessage],
		activeMessageId: null,
		chunkQuestionReady: false,
		chunkQuestionMessages: [],
		chunkQuestionAnswered: false,
		chunkQuestionText: null,

		setActiveMessageId: (id) => {
			set((state) => {
				state.activeMessageId = id;
			});
		},

		addUserMessage: (text, isChunkQuestion) => {
			const id = crypto.randomUUID();
			if (isChunkQuestion) {
				set((state) => {
					state.chunkQuestionMessages.push({
						id,
						text,
						isUser: true,
					});
				});
			} else {
				set((state) => {
					state.messages.push({
						id,
						text,
						isUser: true,
					});
				});
			}

			return id;
		},
		addBotMessage: (text, isChunkQuestion) => {
			const id = crypto.randomUUID();
			if (isChunkQuestion) {
				set((state) => {
					state.chunkQuestionMessages.push({
						id,
						text,
						isUser: false,
					});
				});
			} else {
				set((state) => {
					state.messages.push({
						id,
						text,
						isUser: false,
					});
				});
			}

			return id;
		},
		addBotMessageElement: (Comp) => {
			set((state) => {
				state.chunkQuestionMessages.push({
					id: crypto.randomUUID(),
					isUser: false,
					Node: <Comp />,
				});
			});
		},

		updateBotMessage: (id, text, isChunkQuestion) => {
			set((state) => {
				if (isChunkQuestion) {
					const messageIndex = state.chunkQuestionMessages.findIndex(
						(message) => message.id === id,
					);
					if (messageIndex !== -1) {
						// @ts-ignore
						state.chunkQuestionMessages[messageIndex].text = text;
					}
				} else {
					const messageIndex = state.messages.findIndex(
						(message) => message.id === id,
					);
					if (messageIndex !== -1) {
						// @ts-ignore
						state.messages[messageIndex].text = text;
					}
				}
			});
		},

		setChunkQuestionAnswered: (value) => {
			set((state) => {
				state.chunkQuestionAnswered = value;
			});
		},
		addChunkQuestionStairs: (value) => {
			set((state) => {
				state.chunkQuestionText = value;
				state.chunkQuestionMessages = [
					{
						id: crypto.randomUUID(),
						isUser: false,
						Node: (
							<ChunkQuestionReadyStairs
								onClick={() => {
									set((state) => {
										state.chunkQuestionReady = true;
									});
									get().addBotMessageElement(() => <p>{value}</p>);
								}}
							/>
						),
					},
				];
			});
		},
		syncMessages: async () => {
			const messagesChunkQuestion = get().chunkQuestionMessages;
			const messages = get().messages;
			const messagesToAdd: Message[] = [];
			messagesChunkQuestion.forEach((message) => {
				if ("text" in message && !messages.includes(message)) {
					messagesToAdd.push(message);
				}
			});

			set((state) => {
				state.messages.push(...messagesToAdd);
			});
		},
	})),
);

export const getChatHistory = (messages: Message[]): ChatHistory => {
	return messages
		.filter((m) => "text" in m && m.id !== welcomeMessage.id)
		.map((m) => ({
			agent: m.isUser ? "user" : "bot",
			// @ts-ignore
			text: m.text,
		}));
};

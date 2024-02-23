import { ChunkQuestionReady } from "@/components/chat/chunk-question-ready";
import { BotMessage, Message } from "@itell/core/chatbot";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ChatProps {
	messages: Message[];
	activeMessageId: string | null;

	chunkQuestionAnswered: boolean;
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
	addChunkQuestion: (value: string) => void;
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
		addChunkQuestion: (value) => {
			set((state) => {
				state.chunkQuestionText = value;
				state.chunkQuestionMessages = [
					{
						id: crypto.randomUUID(),
						isUser: false,
						Node: (
							<ChunkQuestionReady
								onClick={() => {
									get().addBotMessageElement(() => (
										<div className="space-y-2">
											<p>{value}</p>
										</div>
									));
								}}
							/>
						),
					},
				];
			});
		},
	})),
);

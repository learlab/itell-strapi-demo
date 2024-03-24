import { StairsReadyButton } from "@/components/chat/stairs-button";
import { BotMessage, ChatHistory, Message } from "@itell/core/chatbot";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type StairsQuestion = {
	text: string;
	chunk: string;
	question_type: string;
};

interface ChatProps {
	messages: Message[];
	activeMessageId: string | null;
	stairsAnswered: boolean;
	stairsReady: boolean;
	stairsTimestamp: number | null;
	stairsQuestion: StairsQuestion | null;
	stairsMessages: Message[];
}

interface ChatState extends ChatProps {
	addUserMessage: (text: string, isStairs?: boolean) => string;
	addBotMessage: (text: string, isStairs?: boolean) => string;
	addBotMessageElement: (comp: () => JSX.Element) => void;
	updateBotMessage: (id: string, text: string, isStairs?: boolean) => void;
	setActiveMessageId: (id: string | null) => void;
	setStairsAnswered: (value: boolean) => void;
	addStairsQuestion: (value: StairsQuestion) => void;
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
		stairsReady: false,
		stairsMessages: [],
		stairsAnswered: false,
		stairsQuestion: null,
		stairsTimestamp: null,

		setActiveMessageId: (id) => {
			set((state) => {
				state.activeMessageId = id;
			});
		},

		addUserMessage: (text, isStairs) => {
			const id = crypto.randomUUID();
			if (isStairs) {
				set((state) => {
					state.stairsMessages.push({
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
		addBotMessage: (text, isStairs) => {
			const id = crypto.randomUUID();
			if (isStairs) {
				set((state) => {
					state.stairsMessages.push({
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
				state.stairsMessages.push({
					id: crypto.randomUUID(),
					isUser: false,
					Node: <Comp />,
				});
			});
		},

		updateBotMessage: (id, text, isStairs) => {
			set((state) => {
				if (isStairs) {
					const messageIndex = state.stairsMessages.findIndex(
						(message) => message.id === id,
					);
					if (messageIndex !== -1) {
						// @ts-ignore
						state.stairsMessages[messageIndex].text = text;
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

		setStairsAnswered: (value) => {
			set((state) => {
				state.stairsAnswered = value;
			});
		},
		addStairsQuestion: (value) => {
			set((state) => {
				state.stairsQuestion = value;
				state.stairsMessages = [
					{
						id: crypto.randomUUID(),
						isUser: false,
						Node: (
							<StairsReadyButton
								onClick={() => {
									set((state) => {
										state.stairsReady = true;
										state.stairsTimestamp = Date.now();
									});
									get().addBotMessageElement(() => <p>{value.text}</p>);
								}}
							/>
						),
					},
				];
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

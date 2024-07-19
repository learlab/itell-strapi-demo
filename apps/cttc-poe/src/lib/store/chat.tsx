import { StairsReadyButton } from "@/components/chat/stairs-button";
import { BotMessage, ChatHistory, Message } from "@itell/core/chat";
import { createStore } from "zustand";
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

export interface ChatState extends ChatProps {
	addUserMessage: (text: string, isStairs?: boolean) => string;
	addBotMessage: (text: string, isStairs?: boolean, context?: string) => string;
	addBotMessageElement: (comp: () => JSX.Element) => void;
	updateBotMessage: (
		id: string,
		text: string,
		isStairs?: boolean,
		context?: string,
	) => void;
	setActiveMessageId: (id: string | null) => void;
	setStairsAnswered: (value: boolean) => void;
	addStairsQuestion: (value: StairsQuestion) => void;
}

const id = crypto.randomUUID();

export const getChatHistory = (messages: Message[]): ChatHistory => {
	return messages
		.filter((m) => "text" in m && m.id === id)
		.map((m) => ({
			agent: m.isUser ? "user" : "bot",
			// @ts-ignore
			text: m.text,
		}));
};
export type ChatStore = ReturnType<typeof createChatStore>;

export const createChatStore = ({ pageTitle }: { pageTitle: string }) => {
	const welcomeMessage: BotMessage = {
		id,
		isUser: false,
		Node: (
			<p>
				Hello, how can I help you with{" "}
				<span className="font-semibold italic">{pageTitle}</span> ?
			</p>
		),
	};

	return createStore<ChatState>()(
		immer((set, get) => ({
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
			addBotMessage: (text, isStairs, context) => {
				const id = crypto.randomUUID();
				if (isStairs) {
					set((state) => {
						state.stairsMessages.push({
							id,
							text,
							isUser: false,
							context,
						});
					});
				} else {
					set((state) => {
						state.messages.push({
							id,
							text,
							isUser: false,
							context,
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

			updateBotMessage: (id, text, isStairs, context) => {
				set((state) => {
					if (isStairs) {
						const messageIndex = state.stairsMessages.findIndex(
							(message) => message.id === id,
						);
						if (messageIndex !== -1) {
							const message = state.stairsMessages[messageIndex];
							if ("text" in message) {
								message.text = text;
							}
							if (!message.isUser) {
								message.context = context;
							}
						}
					} else {
						const messageIndex = state.messages.findIndex(
							(message) => message.id === id,
						);
						if (messageIndex !== -1) {
							const message = state.messages[messageIndex];
							if ("text" in message) {
								message.text = text;
							}
							if (!message.isUser && context) {
								message.context = context;
							}
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
					state.stairsReady = false;
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
};

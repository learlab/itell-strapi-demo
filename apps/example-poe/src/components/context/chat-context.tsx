"use client";

import { createChatMessage } from "@/lib/server-actions";
import { BotMessage, Message, UserMessage } from "@itell/core/chatbot";
import { useLocalStorage } from "@itell/core/hooks";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button } from "../client-components";

type ChatContextType = {
	messages: Message[];
	addMessage: (message: Message) => void;
	updateMessage: (
		id: string,
		updateFn: (prevText: string) => string,
		isFinal?: boolean,
	) => void;
	activeMessageId: string | undefined;
	setActiveMessageId: (id: string | undefined) => void;
	chunkQuestionAnswered: boolean;
	setChunkQuestionAnswered: (value: boolean) => void;
	setChunkQuestion: (value: string) => void;
};

export const ChatContext = createContext<ChatContextType>(
	{} as ChatContextType,
);

const id1 = crypto.randomUUID();
const id2 = crypto.randomUUID();

type Props = {
	pageSlug: string;
	children: React.ReactNode;
};

export function ChatProvider({ children, pageSlug }: Props) {
	const message1: BotMessage = {
		id: id1,
		text: "Hello, how can I help you?",
		isUser: false,
		isChunkQuestion: false,
	};

	const [chunkQuestionAnswered, setChunkQuestionAnswered] = useState(false);
	const [messages, setMessages] = useState<Message[]>([message1]);
	const [activeMessageId, setActiveMessageId] = useState<string | undefined>();

	const [chunkQuestion, setChunkQuestion] = useState<string | null>(null);
	const ref = useRef<HTMLButtonElement>(null);
	const lastUserMessage = useRef<UserMessage | null>();

	useEffect(() => {
		if (chunkQuestion) {
			clearChunkQuestionMessages();
			addMessage({
				id: id2,
				isUser: false,
				isChunkQuestion: true,
				Element: () => (
					<div className="space-y-2">
						<p>When you are ready for the question, click the button below.</p>
						<Button
							size={"sm"}
							variant={"outline"}
							className="animate-out duration-200 ease-out"
							id="chunk-question-ready"
							ref={ref}
							onClick={() => {
								addMessage({
									id: crypto.randomUUID(),
									isUser: false,
									isChunkQuestion: true,
									Element: () => (
										<div className="space-y-2">
											<p>{chunkQuestion}</p>
										</div>
									),
								});

								if (ref.current) {
									ref.current.disabled = true;
								}
							}}
						>
							I'm ready for question
						</Button>
					</div>
				),
			});
		}
	}, [chunkQuestion]);

	const addMessage = (message: Message) => {
		setMessages((prev) => [...prev, message]);

		if (message.isUser && !message.isChunkQuestion) {
			lastUserMessage.current = message;
		}
	};

	const clearChunkQuestionMessages = () => {
		setMessages(messages.filter((m) => !m.isChunkQuestion));
	};

	const updateMessage = (
		id: string,
		updateFn: (prevText: string) => string,
		isFinal?: boolean,
	) => {
		if (!isFinal) {
			setMessages((prev) =>
				prev.map((m) => {
					if ("text" in m) {
						if (m.id === id) {
							return {
								...m,
								text: updateFn(m.text),
							};
						}
					}
					return m;
				}),
			);
		} else {
			// save user-bot message pair
			const botMessage: BotMessage = {
				id,
				text: updateFn(""),
				isChunkQuestion: false,
				isUser: false,
			};
			const userMessage = lastUserMessage.current;
			if (userMessage) {
				console.log("saving", userMessage, botMessage);
				createChatMessage({ pageSlug, userMessage, botMessage });
			}
		}
	};

	return (
		<ChatContext.Provider
			value={{
				messages,
				activeMessageId,
				addMessage,
				updateMessage,
				setActiveMessageId,
				chunkQuestionAnswered,
				setChunkQuestionAnswered,
				setChunkQuestion,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export const useChat = () => useContext(ChatContext);

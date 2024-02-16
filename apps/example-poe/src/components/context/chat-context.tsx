"use client";

import { Message, Messages } from "@itell/core/chatbot";
import { useLocalStorage } from "@itell/core/hooks";
import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "../client-components";

type ChatContextType = {
	showChatbot: boolean;
	setShowChatbot: (value: boolean | ((val: boolean) => boolean)) => void;
	messages: Message[];
	addMessage: (message: Message) => void;
	removeMessage: (id: string) => void;
	updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
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

export function ChatProvider({ children }: { children: React.ReactNode }) {
	const message1 = {
		id: id1,
		text: "Hello, how can I help you?",
		isUserMessage: false,
		isChunkQuestion: false,
	};

	const [chunkQuestionAnswered, setChunkQuestionAnswered] = useState(false);
	const [show, setShow] = useLocalStorage<boolean>("show-chatbot", true);
	const [messages, setMessages] = useState<Message[]>([message1]);
	const [activeMessageId, setActiveMessageId] = useState<string | undefined>();

	const [chunkQuestion, setChunkQuestion] = useState<string | null>(null);

	useEffect(() => {
		if (chunkQuestion) {
			clearChunkQuestionMessages();
			addMessage({
				id: id2,
				isUserMessage: false,
				isChunkQuestion: true,
				Element: () => (
					<div className="space-y-2">
						<p>When you are ready for the question, click the button below.</p>
						<Button
							size={"sm"}
							variant={"outline"}
							onClick={() =>
								addMessage({
									id: crypto.randomUUID(),
									isUserMessage: false,
									isChunkQuestion: true,
									Element: () => (
										<div className="space-y-2">
											<p>{chunkQuestion}</p>
										</div>
									),
								})
							}
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
	};

	const removeMessage = (id: string) => {
		setMessages((prev) => prev.filter((message) => message.id !== id));
	};

	const clearChunkQuestionMessages = () => {
		setMessages(messages.filter((m) => !m.isChunkQuestion));
	};

	const updateMessage = (
		id: string,
		updateFn: (prevText: string) => string,
	) => {
		setMessages((prev) =>
			prev.map((message) => {
				if (message.id === id) {
					if ("text" in message) {
						return { ...message, text: updateFn(message.text) };
					}
				}
				return message;
			}),
		);
	};

	return (
		<ChatContext.Provider
			value={{
				messages,
				activeMessageId,
				addMessage,
				removeMessage,
				updateMessage,
				setActiveMessageId,
				chunkQuestionAnswered,
				setChunkQuestionAnswered,
				setChunkQuestion,
				showChatbot: show,
				setShowChatbot: setShow,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export const useChat = () => useContext(ChatContext);

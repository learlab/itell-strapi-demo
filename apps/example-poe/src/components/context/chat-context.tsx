"use client";

import { Message } from "@/lib/chat";
import { createContext, useContext, useState } from "react";

const defaultValue = [
	{
		id: crypto.randomUUID(),
		text: "Hello, how can I help you?",
		isUserMessage: false,
	},
];

type ChatContextType = {
	messages: Message[];
	isMessageUpdating: boolean;
	addMessage: (message: Message) => void;
	removeMessage: (id: string) => void;
	updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
	setIsMessageUpdating: (isUpdating: boolean) => void;
	activeMessageId: string | undefined;
	setActiveMessageId: (id: string | undefined) => void;
};

export const ChatContext = createContext<ChatContextType>(
	{} as ChatContextType,
);

export function ChatProvider({ children }: { children: React.ReactNode }) {
	const [messages, setMessages] = useState(defaultValue);
	const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false);
	const [activeMessageId, setActiveMessageId] = useState<string | undefined>();

	const addMessage = (message: Message) => {
		setMessages((prev) => [...prev, message]);
	};

	const removeMessage = (id: string) => {
		setMessages((prev) => prev.filter((message) => message.id !== id));
	};

	const updateMessage = (
		id: string,
		updateFn: (prevText: string) => string,
	) => {
		setMessages((prev) =>
			prev.map((message) => {
				if (message.id === id) {
					return { ...message, text: updateFn(message.text) };
				}
				return message;
			}),
		);
	};

	return (
		<ChatContext.Provider
			value={{
				messages,
				isMessageUpdating,
				activeMessageId,
				addMessage,
				removeMessage,
				updateMessage,
				setIsMessageUpdating,
				setActiveMessageId,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export const useChat = () => useContext(ChatContext);

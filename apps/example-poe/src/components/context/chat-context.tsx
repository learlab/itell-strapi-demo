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

export const ChatContext = createContext<{
	messages: Message[];
	isMessageUpdating: boolean;
	addMessage: (message: Message) => void;
	removeMessage: (id: string) => void;
	updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
	setIsMessageUpdating: (isUpdating: boolean) => void;
}>({
	messages: [],
	isMessageUpdating: false,
	addMessage: () => {},
	removeMessage: () => {},
	updateMessage: () => {},
	setIsMessageUpdating: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
	const [messages, setMessages] = useState(defaultValue);
	const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false);

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
				addMessage,
				removeMessage,
				updateMessage,
				setIsMessageUpdating,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export const useChat = () => useContext(ChatContext);

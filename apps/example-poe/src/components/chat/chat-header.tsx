"use client";

import { XIcon } from "lucide-react";
import { useChat } from "../context/chat-context";

export const ChatHeader = () => {
	const { setShowChatbot } = useChat();

	return (
		<div className="w-full flex flex-row gap-3 justify-between items-start ">
			<div className="flex flex-col items-start text-sm">
				<p className="text-xs">Chat with</p>
				<div className="flex gap-1.5 items-center">
					<p className="w-2 h-2 rounded-full bg-green-500" />
					<p className="font-medium">ITELL AI</p>
				</div>
			</div>
			<button onClick={() => setShowChatbot(false)}>
				<XIcon className="size-4" />
			</button>
		</div>
	);
};

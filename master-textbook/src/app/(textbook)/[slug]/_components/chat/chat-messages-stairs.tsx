"use client";
import { useChatStore } from "@/components/provider/page-provider";
import { SelectStairsMessages } from "@/lib/store/chat-store";
import { BotMessage } from "@itell/core/chat";
import { useSelector } from "@xstate/store/react";
import { useMemo } from "react";
import { ChatItems } from "./chat-items";
import { StairsReadyButton } from "./stairs-button";

export const ChatMessagesStairs = () => {
	const store = useChatStore();
	const messages = useSelector(store, SelectStairsMessages);
	const initialMessage = useMemo<BotMessage>(
		() => ({
			id: crypto.randomUUID(),
			isUser: false,
			text: "",
			node: (
				<StairsReadyButton
					onClick={() => {
						store.send({ type: "setStairsReady" });
					}}
				/>
			),
		}),
		[],
	);

	return <ChatItems data={messages} initialMessage={initialMessage} />;
};

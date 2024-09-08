"use client";

import { useChatStore } from "@/components/provider/page-provider";
import {
	SelectMessages,
	StoreMessage,
	botMessage,
} from "@/lib/store/chat-store";
import { Message } from "@itell/core/chat";
import { useSelector } from "@xstate/store/react";
import { useMemo } from "react";
import { ChatItems } from "./chat-items";

type Props = {
	data: Message[];
	updatedAt: Date;
	pageTitle: string;
};

export const ChatMessages = ({ data, updatedAt, pageTitle }: Props) => {
	const store = useChatStore();
	const messages = useSelector(store, SelectMessages);

	const welcomeMessage = useMemo<StoreMessage>(
		() =>
			botMessage({
				text: "",
				isStairs: false,
				node: (
					<p>
						Hello, how can I help you with{" "}
						<span className="font-semibold italic">{pageTitle}</span> ?
					</p>
				),
			}),
		[],
	);

	return (
		<ChatItems
			initialMessage={welcomeMessage}
			data={messages}
			prevData={data}
			updatedAt={updatedAt}
		/>
	);
};

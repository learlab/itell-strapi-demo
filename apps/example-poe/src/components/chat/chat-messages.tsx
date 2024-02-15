"use client";

import { Message } from "@itell/core/chatbot";
import { cn } from "@itell/core/utils";
import { Session } from "next-auth";
import { Avatar, AvatarImage } from "../client-components";
import { useChat } from "../context/chat-context";
import { Spinner } from "../spinner";
import { UserAvatar } from "../user-avatar";

type Props = {
	user: {
		name: string | null | undefined;
		image: string | null | undefined;
	};
	isChunkQuestion: boolean;
};

export const ChatMessages = ({ user, isChunkQuestion }: Props) => {
	const { messages, activeMessageId } = useChat();
	const inverseMessages = messages
		.filter((m) => m.isChunkQuestion === isChunkQuestion)
		.slice()
		.reverse();

	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-3 px-2 py-3 flex-1 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
			)}
		>
			<div className="flex-1 flex-grow" />
			{inverseMessages.map((message) => {
				return (
					<div className="chat-message" key={`${message.id}-${message.id}`}>
						<div
							className={cn("flex items-end", {
								"justify-end": message.isUserMessage,
							})}
						>
							<div
								className={cn(
									"flex flex-row items-center space-x-2 text-sm max-w-xs mx-2 overflow-x-hidden",
									message.isUserMessage ? "justify-end" : "justify-start",
								)}
							>
								{message.isUserMessage ? (
									<UserAvatar user={user} className="order-last" />
								) : (
									<Avatar className="rounded-none w-8 h-8">
										<AvatarImage src="/images/itell-ai.svg" />
									</Avatar>
								)}

								{activeMessageId === message.id ? (
									<Spinner className="size-4" />
								) : (
									<div
										className={cn("px-4 py-2 rounded-lg", {
											"bg-blue-600 text-white": message.isUserMessage,
											"bg-gray-200 text-gray-900": !message.isUserMessage,
										})}
									>
										{"text" in message ? (
											<p>{message.text}</p>
										) : (
											<div>
												<message.Element />
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

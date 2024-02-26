"use client";

import { SessionUser } from "@/lib/auth";
import { useChatStore } from "@/lib/store/chat";
import { Message } from "@itell/core/chatbot";
import { cn, relativeDate } from "@itell/core/utils";
import { Avatar, AvatarImage } from "../client-components";
import { Spinner } from "../spinner";
import { UserAvatar } from "../user-avatar";

type Props = {
	user: NonNullable<SessionUser>;
	isChunkQuestion: boolean;
	data?: Message[];
	updatedAt?: Date;
};

export const ChatMessages = ({
	user,
	isChunkQuestion,
	data,
	updatedAt,
}: Props) => {
	const oldMessages = isChunkQuestion ? [] : data || [];
	const newMessages = isChunkQuestion
		? useChatStore((state) => state.chunkQuestionMessages)
		: useChatStore((state) => state.messages);

	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-3 px-2 py-3 flex-1 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
			)}
		>
			<div className="flex-1 flex-grow space-y-1">
				{oldMessages.map((message) => {
					return <MessageItem key={message.id} user={user} message={message} />;
				})}
				{oldMessages.length > 0 && (
					<div className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground my-4">
						<div className="w-16 h-1 bg-muted" />
						{updatedAt && `Last visited at ${relativeDate(updatedAt)}`}
						<div className="w-16 h-1 bg-muted" />
					</div>
				)}
				{newMessages.map((message) => {
					return <MessageItem key={message.id} user={user} message={message} />;
				})}
			</div>
		</div>
	);
};

const MessageItem = ({
	message,
	user,
}: { message: Message; user: NonNullable<SessionUser> }) => {
	const activeMessageId = useChatStore((state) => state.activeMessageId);
	return (
		<div className="chat-message" key={`${message.id}-${message.id}`}>
			<div
				className={cn("flex items-end", {
					"justify-end": message.isUser,
				})}
			>
				<div
					className={cn(
						"flex flex-row items-center space-x-2 text-sm max-w-xs mx-2 overflow-x-hidden",
						message.isUser ? "justify-end" : "justify-start",
					)}
				>
					{message.isUser ? (
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
								"bg-blue-600 text-white": message.isUser,
								"bg-gray-200 text-gray-900": !message.isUser,
							})}
						>
							{"text" in message ? <p>{message.text}</p> : message.Node}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

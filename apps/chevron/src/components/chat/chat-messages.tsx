"use client";

import { useChatStore } from "@/lib/store/chat";
import { Message } from "@itell/core/chatbot";
import { cn, relativeDate } from "@itell/core/utils";
import { Avatar, AvatarImage } from "../client-components";
import { Spinner } from "../spinner";
import { UserAvatar } from "../user-avatar";
import { Button } from "@/components/client-components";

type Props = {
	userName: string | null;
	userImage: string | null;
	isStairs: boolean;
	data?: Message[];
	updatedAt?: Date;
};

export const ChatMessages = ({
	userName,
	userImage,
	isStairs,
	data,
	updatedAt,
}: Props) => {
	const oldMessages = isStairs ? [] : data || [];
	const newMessages = isStairs
		? useChatStore((state) => state.stairsMessages)
		: useChatStore((state) => state.messages);

	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-3 px-2 py-3 flex-1 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
			)}
		>
			<div className="flex-1 flex-grow space-y-1">
				{oldMessages.map((message) => {
					return (
						<MessageItem
							key={message.id}
							userName={userName}
							userImage={userImage}
							message={message}
						/>
					);
				})}
				{oldMessages.length > 0 && (
					<div className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground my-4">
						<div className="w-16 h-1 bg-muted" />
						{updatedAt && `Last visited at ${relativeDate(updatedAt)}`}
						<div className="w-16 h-1 bg-muted" />
					</div>
				)}
				{newMessages.map((message) => {
					return (
						<MessageItem
							key={message.id}
							userImage={userImage}
							userName={userName}
							message={message}
						/>
					);
				})}
			</div>
		</div>
	);
};

const MessageItem = ({
	userName,
	userImage,
	message,
}: { userName: string | null; userImage: string | null; message: Message }) => {
	const activeMessageId = useChatStore((state) => state.activeMessageId);
	let formattedSlug = "";
	// Get div where data-subsection-id is message.context
	if (message.context) {
		formattedSlug = message.context.split("-").slice(0, -1).join(" ");
		const div = document.querySelector(
			`div[data-subsection-id="${message.context}"]`,
		);
		if (div) {
			div.id = message.context;
		}
	}
	return (
		<div className="chat-message" key={`${message.id}-${message.id}`}>
			<div
				className={cn("flex items-end", {
					"justify-end": message.isUser,
				})}
			>
				<div
					className={cn(
						"flex flex-row items-center gap-1 text-sm max-w-xs mx-2 overflow-x-hidden",
						message.isUser ? "justify-end" : "justify-start",
					)}
				>
					{message.isUser ? (
						<UserAvatar
							image={userImage}
							name={userName}
							className="order-last"
						/>
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
							{message.context && (
								<a href={`#${message.context}`}>
									<Button variant={"outline"} size={"sm"} className="mt-1">
										Source:{" "}
										{formattedSlug.length > 25
											? `${formattedSlug.slice(0, 22)}...`
											: formattedSlug}
									</Button>
								</a>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

"use client";

import { Button } from "@/components/client-components";
import { useChatStore } from "@/lib/store/chat";
import { getChunkElement, scrollToElement } from "@/lib/utils";
import { Message } from "@itell/core/chatbot";
import { cn, relativeDate } from "@itell/core/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "../client-components";
import { Spinner } from "../spinner";
import { UserAvatar } from "../user-avatar";

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
			<div className="flex-1 flex-grow space-y-2">
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
	const router = useRouter();
	const context = "context" in message ? message.context : "";
	let formattedSlug = "";
	// Get div where data-subsection-id is message.context
	if (context) {
		if (context === "[User Guide]") {
			formattedSlug = "User Guide";
		} else {
			formattedSlug = context.split("-").slice(0, -1).join(" ");
		}
	}

	return (
		<div
			className={cn("chat-message flex items-end", {
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
							"bg-secondary-foreground text-background": message.isUser,
							"bg-accent text-foreground/80": !message.isUser,
						})}
					>
						{"text" in message ? <p>{message.text}</p> : message.Node}
						{context && (
							<Button
								size={"sm"}
								variant={"outline"}
								className="mt-1"
								onClick={() => {
									if (context === "[User Guide]") {
										router.push("/guide");
									} else {
										const element = getChunkElement(context);
										if (element) {
											scrollToElement(element);
											return;
										}

										toast.warning("Source not found");
									}
								}}
							>
								Source:{" "}
								{formattedSlug.length > 25
									? `${formattedSlug.slice(0, 22)}...`
									: formattedSlug}
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

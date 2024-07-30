"use client";

import { useChat } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { UserAvatar } from "@/components/user-avatar";
import { getChunkElement, scrollToElement } from "@/lib/utils";
import { Message } from "@itell/core/chat";
import { cn, relativeDate } from "@itell/core/utils";
import { AvatarFallback, Button } from "@itell/ui/client";
import { Avatar, AvatarImage } from "@itell/ui/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
	isStairs: boolean;
	data?: Message[];
	updatedAt?: Date;
};

export const ChatMessages = ({ isStairs, data, updatedAt }: Props) => {
	const oldMessages = isStairs ? [] : data || [];
	const newMessages = isStairs
		? useChat((state) => state.stairsMessages)
		: useChat((state) => state.messages);

	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-3 px-2 py-3 flex-1 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
			)}
		>
			<div className="flex-1 flex-grow space-y-2" role="status">
				{oldMessages.map((message) => {
					return <MessageItem key={message.id} message={message} />;
				})}
				{oldMessages.length > 0 && (
					<div className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground my-4">
						<div className="w-16 h-1 bg-muted" />
						{updatedAt && `Last visited at ${relativeDate(updatedAt)}`}
						<div className="w-16 h-1 bg-muted" />
					</div>
				)}
				{newMessages.map((message) => {
					return <MessageItem key={message.id} message={message} />;
				})}
			</div>
		</div>
	);
};

const MessageItem = ({ message }: { message: Message }) => {
	const activeMessageId = useChat((state) => state.activeMessageId);
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
			// only announce the message if it's not from the user
			role={message.isUser ? "" : "status"}
		>
			<div
				className={cn(
					"flex flex-row items-center gap-1 text-sm max-w-xs mx-2 overflow-x-hidden",
					message.isUser ? "justify-end" : "justify-start",
				)}
			>
				{message.isUser ? (
					<UserAvatar className="order-last" alt={"user"} />
				) : (
					<Avatar className="rounded-none w-8 h-8">
						<AvatarImage src="/images/itell-ai.svg" alt={"itell ai says"} />
						<AvatarFallback>AI</AvatarFallback>
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

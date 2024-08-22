import { useChatStore } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { SelectActiveMessageId } from "@/lib/store/chat-store";
import { scrollToElement } from "@/lib/utils";
import { Message } from "@itell/core/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { Button } from "@itell/ui/button";
import { cn, getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import htmr from "htmr";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
	initialMessage: Message;
	updatedAt?: Date;
	prevData?: Message[];
	data: Message[];
};

export const ChatItems = ({
	initialMessage,
	data,
	prevData,
	updatedAt,
}: Props) => {
	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-3 px-2 py-3 flex-1 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
			)}
		>
			<div className="flex-1 flex-grow space-y-2" role="status">
				{prevData?.map((message) => {
					return <MessageItem key={message.id} message={message} />;
				})}
				{prevData && prevData.length > 0 && (
					<div className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground my-4">
						<div className="w-16 h-1 bg-muted" />
						{updatedAt && `Last visited at ${updatedAt.toLocaleTimeString()}`}
						<div className="w-16 h-1 bg-muted" />
					</div>
				)}
				{initialMessage && <MessageItem message={initialMessage} />}
				{data.map((message) => {
					return <MessageItem key={message.id} message={message} />;
				})}
			</div>
		</div>
	);
};

const Blockquote = ({ children }: { children?: React.ReactNode }) => {
	return (
		<blockquote className="border-l-4 border-primary pl-4 mt-2 bg-accent italic">
			{children}
		</blockquote>
	);
};

const components = {
	blockquote: Blockquote,
};

const MessageItem = ({ message }: { message: Message }) => {
	const store = useChatStore();
	const activeMessageId = useSelector(store, SelectActiveMessageId);

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
					"flex flex-row items-start gap-1 text-sm max-w-xs mx-2 overflow-x-hidden",
					message.isUser ? "justify-end" : "justify-start",
				)}
			>
				{message.isUser ? (
					<Avatar className="rounded-none w-8 h-8 order-last">
						<AvatarImage src="/images/user.svg" />
						<AvatarFallback>User</AvatarFallback>
					</Avatar>
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
							"border-2 bg-primary-foreground": !message.isUser,
							"bg-accent": message.isUser,
						})}
					>
						<Transform message={message} />
					</div>
				)}
			</div>
		</div>
	);
};

const Transform = ({ message }: { message: Message }) => {
	const router = useRouter();

	if (message.node) {
		return (
			<>
				{message.text !== "" && <p>{message.text}</p>}
				{message.node}
			</>
		);
	}

	// Get div where data-subsection-id is message.context
	if (message.context !== undefined) {
		const formattedSlug =
			message.context === "[User Guide]"
				? "User Guide"
				: message.context.split("-").slice(0, -1).join(" ");

		return (
			<>
				<p>{message.text}</p>
				<Button
					size={"sm"}
					variant={"outline"}
					className="mt-1"
					onClick={() => {
						if (message.context === "[User Guide]") {
							router.push("/guide");
						} else {
							const element = getChunkElement(message.context || null);
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
						? `${formattedSlug.slice(0, 25)}...`
						: formattedSlug}
				</Button>
			</>
		);
	}

	return message.transform ? (
		htmr(message.text, { transform: components })
	) : (
		<p>{message.text}</p>
	);
};

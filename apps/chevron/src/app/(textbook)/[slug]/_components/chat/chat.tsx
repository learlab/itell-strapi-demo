"use client";
import { useChat } from "@/components/provider/page-provider";
import { Message } from "@itell/core/chat";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@itell/ui/client";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
	pageSlug: string;
	data: Message[];
	updatedAt: Date;
};

export const Chat = ({ pageSlug, data, updatedAt }: Props) => {
	const { open, setOpen } = useChat((state) => ({
		open: state.open,
		setOpen: state.setOpen,
	}));
	return (
		<Accordion
			type="single"
			value={open ? "chat" : ""}
			onValueChange={(value) => setOpen(value === "chat")}
			collapsible
			className="fixed right-8 bottom-12 w-80 lg:w-96 rounded-md bg-background text-foreground border border-border z-30 chatbot"
		>
			<AccordionItem value="chat" className="overflow-hidden">
				<AccordionTrigger className="border border-border px-6">
					<ChatHeader />
				</AccordionTrigger>

				<AccordionContent className="">
					<div className="flex flex-col h-96">
						<ChatMessages data={data} isStairs={false} updatedAt={updatedAt} />
						<ChatInput pageSlug={pageSlug} />
					</div>
					<footer className="px-4 py-2 text-xs text-muted-foreground">
						This content has been AI-generated and may contain errors.{" "}
					</footer>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

"use client";
import { useChatStore } from "@/components/provider/page-provider";
import { SelectOpen } from "@/lib/store/chat-store";
import { Elements } from "@itell/constants";
import { Message } from "@itell/core/chat";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@itell/ui/client";
import { useSelector } from "@xstate/store/react";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
	pageTitle: string;
	pageSlug: string;
	updatedAt: Date;
	data: Message[];
};

export const Chat = ({ pageSlug, pageTitle, updatedAt, data }: Props) => {
	const store = useChatStore();
	const open = useSelector(store, SelectOpen);
	return (
		<Accordion
			id={Elements.CHATBOT_CONTAINER}
			type="single"
			value={open ? "chat" : ""}
			onValueChange={(val) =>
				store.send({ type: "setOpen", value: val === "chat" })
			}
			collapsible
			className="fixed right-8 bottom-12 w-80 lg:w-96 rounded-md bg-background text-foreground border border-border z-30"
		>
			<AccordionItem value="chat" className="overflow-hidden">
				<AccordionTrigger className="border border-border px-6">
					<ChatHeader />
				</AccordionTrigger>

				<AccordionContent className="">
					<div className="flex flex-col h-96">
						<ChatMessages
							updatedAt={updatedAt}
							data={data}
							pageTitle={pageTitle}
						/>
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

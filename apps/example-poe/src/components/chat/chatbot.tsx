"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
} from "@/components/client-components";
import { useLocalStorage } from "@itell/core/hooks";
import { User } from "@prisma/client";
import { MessageSquareQuote } from "lucide-react";
import { useEffect } from "react";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
	user: User | null;
	pageSlug: string;
};

export const Chatbot = ({ pageSlug, user }: Props) => {
	const [show, setShow] = useLocalStorage<boolean>("show-chatbot", true);

	if (!user) {
		return null;
	}

	return (
		<>
			<Button
				variant="ghost"
				className="flex flex-wrap justify-start items-center gap-2 pl-0"
				onClick={() => setShow((val) => !val)}
			>
				<MessageSquareQuote className="size-4" />
				{show ? "Hide chat" : "Show chat"}
			</Button>
			{show && (
				<Accordion
					type="single"
					defaultValue="item-1"
					collapsible
					className="fixed right-8 bottom-12 w-80 lg:w-96 rounded-md bg-background border border-border z-30"
				>
					<AccordionItem value="item-1" className="overflow-hidden">
						<AccordionTrigger className="border border-border px-6">
							<ChatHeader />
						</AccordionTrigger>
						<AccordionContent className="">
							<div className="flex flex-col h-96">
								{user ? (
									<>
										<ChatMessages user={user} />
										<ChatInput pageSlug={pageSlug} />
									</>
								) : (
									<div className="px-2 py-3 text-red-500">
										Please log in to send messages
									</div>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			)}
		</>
	);
};

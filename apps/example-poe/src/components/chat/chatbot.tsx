"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	Button,
} from "@/components/client-components";
import { MessageSquareQuote } from "lucide-react";
import { signIn } from "next-auth/react";
import { useChat } from "../context/chat-context";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
	user: {
		name: string | null | undefined;
		image: string | null | undefined;
	} | null;
	pageSlug: string;
};

export const Chatbot = ({ pageSlug, user }: Props) => {
	const { showChatbot, setShowChatbot } = useChat();
	if (!user) {
		return (
			<Button
				variant="ghost"
				className="flex flex-wrap justify-start items-center gap-2 pl-0"
				onClick={() => signIn("azure-ad")}
			>
				<MessageSquareQuote className="size-4" />
				Show chat
			</Button>
		);
	}

	return (
		<>
			<Button
				variant="ghost"
				className="flex flex-wrap justify-start items-center gap-2 pl-0"
				onClick={() => setShowChatbot((val) => !val)}
			>
				<MessageSquareQuote className="size-4" />
				{showChatbot ? "Hide chat" : "Show chat"}
			</Button>
			{showChatbot && (
				<Accordion
					type="single"
					value="item-1"
					className="fixed right-8 bottom-12 w-80 lg:w-96 rounded-md bg-background border border-border z-30"
				>
					<AccordionItem value="item-1" className="overflow-hidden">
						<div className="border border-border px-6 py-4">
							<ChatHeader />
						</div>
						<AccordionContent className="">
							<div className="flex flex-col h-96">
								{user ? (
									<>
										<ChatMessages user={user} isChunkQuestion={false} />
										<ChatInput pageSlug={pageSlug} isChunkQuestion={false} />
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

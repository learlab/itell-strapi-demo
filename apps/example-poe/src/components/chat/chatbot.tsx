"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
} from "@/components/client-components";
import { User } from "@prisma/client";
import { useState } from "react";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
	user: User | null;
	pageSlug: string;
};

export const Chatbot = ({ pageSlug, user }: Props) => {
	const [show, setShow] = useState(true);

	if (!show) {
		return (
			<Button
				variant={"outline"}
				size={"sm"}
				onClick={() => setShow((prev) => !prev)}
			>
				Show chat
			</Button>
		);
	}

	return (
		<Accordion
			type="single"
			collapsible
			className="fixed right-8 bottom-12 w-80 lg:w-96 rounded-md bg-background border border-border "
		>
			<AccordionItem value="item-1">
				<div className="bg-background overflow-hidden">
					<AccordionTrigger className="border border-border px-6">
						<ChatHeader />
					</AccordionTrigger>
					<AccordionContent>
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
					<div className="flex justify-end py-2">
						<Button
							variant={"outline"}
							size={"sm"}
							onClick={() => setShow(false)}
						>
							Hide chat
						</Button>
					</div>
				</div>
			</AccordionItem>
		</Accordion>
	);
};

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/client-components";
import { User } from "@prisma/client";
import ChatHeader from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
	user: User | null;
	pageSlug: string;
};

export const Chatbot = ({ pageSlug, user }: Props) => {
	return (
		<Accordion
			type="single"
			collapsible
			className="fixed right-8 w-80 lg:w-96 bottom-12 rounded-md bg-background border border-border "
		>
			<AccordionItem value="item-1">
				<div className="bg-background overflow-hidden">
					<div className=" flex flex-col">
						<AccordionTrigger className="px-6 border border-border">
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
					</div>
				</div>
			</AccordionItem>
		</Accordion>
	);
};

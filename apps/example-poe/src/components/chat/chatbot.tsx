import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/client-components";
import ChatHeader from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

export const Chatbot = () => {
	return (
		<Accordion
			type="single"
			collapsible
			className="fixed right-8 w-80 bottom-12 rounded-md bg-background border border-border "
		>
			<AccordionItem value="item-1">
				<div className="bg-background overflow-hidden">
					<div className=" flex flex-col">
						<AccordionTrigger className="px-6 border border-border">
							<ChatHeader />
						</AccordionTrigger>
						<AccordionContent>
							<div className="flex flex-col h-96">
								<ChatMessages />
								<ChatInput />
							</div>
						</AccordionContent>
					</div>
				</div>
			</AccordionItem>
		</Accordion>
	);
};

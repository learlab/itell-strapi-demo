import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/client-components";
import { Session } from "next-auth";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
	user: Session["user"];
	pageSlug: string;
};

export const ChatbotChunkQuestion = ({ user, pageSlug }: Props) => {
	return (
		<Accordion
			type="single"
			value="item-1"
			className="rounded-md bg-background border border-border z-30"
		>
			<AccordionItem value="item-1" className="overflow-hidden">
				<AccordionContent className="">
					<div className="flex flex-col h-96">
						<ChatMessages
							user={{
								name: user.name,
								image: user.image,
							}}
							isChunkQuestion={true}
						/>
						<ChatInput pageSlug={pageSlug} isChunkQuestion={true} />
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

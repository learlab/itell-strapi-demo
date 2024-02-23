import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/client-components";
import { SessionUser } from "@/lib/auth";
import { ChatExit } from "./chat-exit";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
	user: NonNullable<SessionUser>;
	pageSlug: string;
	onExit: () => void;
};

export const ChatbotChunkQuestion = ({ user, pageSlug, onExit }: Props) => {
	return (
		<Accordion
			type="single"
			value="item-1"
			className="rounded-md bg-background border border-border z-30"
		>
			<AccordionItem value="item-1" className="overflow-hidden">
				<AccordionContent className="">
					<div className="flex flex-col h-96">
						<ChatMessages user={user} isChunkQuestion={true} />
						<ChatInput pageSlug={pageSlug} isChunkQuestion={true} />
						<ChatExit onExit={onExit} />
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

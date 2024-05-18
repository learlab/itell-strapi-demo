import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/client-components";
import { SessionUser } from "@/lib/auth";
import { ChatExit } from "./chat-exit";
import { ChatInput } from "./chat-input";
import { ChatInputStairs } from "./chat-input-stairs";
import { ChatMessages } from "./chat-messages";

type Props = {
	user: NonNullable<SessionUser>;
	pageSlug: string;
	onExit: () => void;
};

export const ChatStairs = ({ user, pageSlug, onExit }: Props) => {
	return (
		<Accordion
			type="single"
			value="item-1"
			className="rounded-md bg-background text-foreground border border-border z-30"
		>
			<AccordionItem value="item-1" className="overflow-hidden">
				<AccordionContent className="flex flex-col h-96">
					<ChatMessages user={user} isStairs={true} />
					<ChatInputStairs pageSlug={pageSlug} user={user} />
					<ChatExit onExit={onExit} />
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

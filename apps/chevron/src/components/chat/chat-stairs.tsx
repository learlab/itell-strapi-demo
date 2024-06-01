import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/client-components";
import { ChatExit } from "./chat-exit";
import { ChatInputStairs } from "./chat-input-stairs";
import { ChatMessages } from "./chat-messages";

type Props = {
	userId: string;
	userName: string | null;
	userImage: string | null;
	pageSlug: string;
	onExit: () => void;
};

export const ChatStairs = ({
	userId,
	userName,
	userImage,
	pageSlug,
	onExit,
}: Props) => {
	return (
		<Accordion
			type="single"
			value="item-1"
			className="rounded-md bg-background text-foreground border border-border z-30"
		>
			<AccordionItem value="item-1" className="overflow-hidden">
				<AccordionContent className="flex flex-col h-96">
					<ChatMessages
						userImage={userImage}
						userName={userName}
						isStairs={true}
					/>
					<ChatInputStairs pageSlug={pageSlug} userId={userId} />
					<ChatExit onExit={onExit} />
					<footer className="px-4 py-2 text-xs text-muted-foreground">
						This content has been AI-generated and may contain errors.{" "}
					</footer>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

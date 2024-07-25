import { Accordion, AccordionContent, AccordionItem } from "@itell/ui/client";
import { ChatInputStairs } from "./chat/chat-input-stairs";
import { ChatMessages } from "./chat/chat-messages";

type Props = {
	userName: string | null;
	userImage: string | null;
	pageSlug: string;
	RenderFooter: () => JSX.Element;
};

export const ChatStairs = ({
	userName,
	userImage,
	pageSlug,
	RenderFooter,
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
					<ChatInputStairs pageSlug={pageSlug} />
					<RenderFooter />
					<footer className="px-4 py-2 text-xs text-muted-foreground">
						This content has been AI-generated and may contain errors.{" "}
					</footer>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

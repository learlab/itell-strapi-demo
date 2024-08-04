import { Elements } from "@itell/core/constants";
import { Accordion, AccordionContent, AccordionItem } from "@itell/ui/client";
import { ChatInputStairs } from "./chat/chat-input-stairs";
import { ChatMessagesStairs } from "./chat/chat-messages-stairs";

interface Props {
	pageSlug: string;
	RenderFooter: () => JSX.Element;
	id?: string;
}

export const ChatStairs = ({ pageSlug, RenderFooter, id }: Props) => {
	return (
		<Accordion
			id={id}
			type="single"
			value="item-1"
			className="rounded-md bg-background text-foreground border border-border z-30"
			role="alert"
			tabIndex={-1}
			aria-relevant="additions"
		>
			<p className="p-4 tracking-tight leading-tight">
				Before continuing, you will be presented a question for the section that
				is highlighted on the left side. When you are ready for the question,
				click the button below.
			</p>
			<a className="sr-only" href={`#${Elements.STAIRS_HIGHLIGHTED_CHUNK}`}>
				go to the relevant section
			</a>
			<AccordionItem value="item-1" className="overflow-hidden">
				<AccordionContent className="flex flex-col h-96">
					<ChatMessagesStairs />
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

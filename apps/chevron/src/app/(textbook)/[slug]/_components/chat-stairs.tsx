import { Elements } from "@/lib/constants";
import { Accordion, AccordionContent, AccordionItem } from "@itell/ui/client";
import { ChatInputStairs } from "./chat/chat-input-stairs";
import { ChatMessages } from "./chat/chat-messages";

type Props = {
	pageSlug: string;
	RenderFooter: () => JSX.Element;
};

export const ChatStairs = ({ pageSlug, RenderFooter }: Props) => {
	return (
		<Accordion
			type="single"
			value="item-1"
			className="rounded-md bg-background text-foreground border border-border z-30"
			role="alert"
			tabIndex={0}
			id={Elements.STAIRS_CONTAINER}
			aria-relevant="additions"
		>
			<p className="p-4 mb-4 tracking-tight leading-tight">
				Before continuing, you will be presented a question for the section that
				is highlighted on the left side. When you are ready for the question,
				click the button below.
			</p>
			<a className="sr-only" href={`#${Elements.STAIRS_HIGHLIGHTED_CHUNK}`}>
				go to the relevant section
			</a>
			<AccordionItem value="item-1" className="overflow-hidden">
				<AccordionContent className="flex flex-col h-96">
					<ChatMessages isStairs={true} />
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

import { Elements } from "@itell/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@itell/ui/accordion";

import { ChatInputStairs } from "./chat/chat-input-stairs";
import { ChatMessagesStairs } from "./chat/chat-messages-stairs";

interface Props {
  pageSlug: string;
  footer: React.ReactNode;
  id?: string;
}

export function ChatStairs({ pageSlug, footer, id }: Props) {
  return (
    <Accordion
      id={id}
      type="single"
      value="item-1"
      className="z-30 rounded-md border border-border bg-background text-foreground"
      role="alert"
      tabIndex={-1}
      aria-relevant="additions"
    >
      <p className="p-4 leading-tight tracking-tight">
        Before continuing, you will be presented a question for the section that
        is highlighted on the left side. When you are ready for the question,
        click the button below.
      </p>
      <a className="sr-only" href={`#${Elements.STAIRS_HIGHLIGHTED_CHUNK}`}>
        go to the relevant section
      </a>
      <AccordionItem value="item-1" className="overflow-hidden">
        <AccordionContent className="flex h-96 flex-col">
          <ChatMessagesStairs />
          <ChatInputStairs pageSlug={pageSlug} />
          {footer}
          <footer className="px-4 py-2 text-xs text-muted-foreground">
            This content has been AI-generated and may contain errors.{" "}
          </footer>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

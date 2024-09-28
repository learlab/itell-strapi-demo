"use client";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectOpen } from "@/lib/store/chat-store";
import { Elements } from "@itell/constants";
import { type Message } from "@itell/core/chat";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@itell/ui/accordion";
import { useSelector } from "@xstate/store/react";

import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

type Props = {
  pageTitle: string;
  pageSlug: string;
  updatedAt: Date;
  data: Message[];
};

export function Chat({ pageSlug, pageTitle, updatedAt, data }: Props) {
  const store = useChatStore();
  const open = useSelector(store, SelectOpen);
  return (
    <Accordion
      id={Elements.CHATBOT_CONTAINER}
      type="single"
      value={open ? "chat" : ""}
      onValueChange={(val) =>
        { store.send({ type: "setOpen", value: val === "chat" }); }
      }
      collapsible
      className="fixed bottom-12 right-8 z-30 w-80 rounded-md border border-border bg-background text-foreground lg:w-96"
    >
      <AccordionItem value="chat" className="overflow-hidden">
        <AccordionTrigger className="border border-border px-6">
          <ChatHeader />
        </AccordionTrigger>

        <AccordionContent className="">
          <div className="flex h-96 flex-col">
            <ChatMessages
              updatedAt={updatedAt}
              data={data}
              pageTitle={pageTitle}
            />
            <ChatInput pageSlug={pageSlug} />
          </div>
          <footer className="px-4 py-2 text-xs text-muted-foreground">
            This content has been AI-generated and may contain errors.{" "}
          </footer>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

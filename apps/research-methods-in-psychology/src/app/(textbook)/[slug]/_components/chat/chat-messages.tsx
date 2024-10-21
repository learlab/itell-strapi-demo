"use client";

import { useMemo } from "react";

import { useChatStore } from "@/components/provider/page-provider";
import {
  botMessage,
  SelectMessages,
  type StoreMessage,
} from "@/lib/store/chat-store";
import { type Message } from "@itell/core/chat";
import { useSelector } from "@xstate/store/react";

import { ChatItems } from "./chat-items";

type Props = {
  data: Message[];
  updatedAt: Date;
  pageTitle: string;
};

export function ChatMessages({ data, updatedAt, pageTitle }: Props) {
  const store = useChatStore();
  const messages = useSelector(store, SelectMessages);

  const initialMessage = useMemo<StoreMessage>(
    () =>
      botMessage({
        text: "initial-message",
        isStairs: false,
        node: (
          <p>
            Hello, how can I help you with{" "}
            <span className="font-semibold italic">{pageTitle}</span> ?
          </p>
        ),
      }),
    [pageTitle]
  );

  return (
    <ChatItems
      initialMessage={initialMessage}
      data={messages}
      prevData={data}
      updatedAt={updatedAt}
    />
  );
}

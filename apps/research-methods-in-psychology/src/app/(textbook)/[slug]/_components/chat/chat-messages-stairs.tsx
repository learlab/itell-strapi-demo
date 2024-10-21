"use client";

import { useMemo } from "react";
import { type BotMessage } from "@itell/core/chat";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectStairsMessages } from "@/lib/store/chat-store";
import { useSelector } from "@xstate/store/react";
import { ChatItems } from "./chat-items";
import { StairsReadyButton } from "./stairs-button";

export function ChatMessagesStairs() {
  const store = useChatStore();
  const messages = useSelector(store, SelectStairsMessages);
  const initialMessage = useMemo<BotMessage>(
    () => ({
      id: crypto.randomUUID(),
      isUser: false,
      text: "initial-message",
      node: (
        <StairsReadyButton
          onClick={() => {
            store.send({ type: "setStairsReady" });
          }}
        />
      ),
    }),
    []
  );

  return <ChatItems data={messages} initialMessage={initialMessage} />;
}

import { type Message } from "@itell/core/chat";
import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";

import type { SnapshotFromStore } from "@xstate/store";
import type React from "react";

type StairsQuestion = {
  text: string;
  chunk: string;
  question_type: string;
};
export type StoreMessage = Message & { isStairs: boolean };
export type ChatStore = ReturnType<typeof createChatStore>;
export const createChatStore = () => {
  return createStoreWithProducer(
    produce,
    {
      open: false as boolean,
      messages: [] as Message[],
      stairsMessages: [] as Message[],
      activeMessageId: null as string | null,
      stairsReady: false as boolean,
      stairsAnswered: false as boolean,
      stairsQuestion: null as StairsQuestion | null,
      stairsTimestamp: null as number | null,
    },
    {
      setOpen: (context, event: { value: boolean }) => {
        context.open = event.value;
      },
      setActive: (context, event: { id: string | null }) => {
        context.activeMessageId = event.id;
      },
      addMessage: (
        context,
        event: {
          data: {
            id?: string;
            text: string;
            isStairs: boolean;
            isUser: boolean;
            transform?: boolean;
            node?: React.ReactNode;
            context?: string;
          };
          setActive?: boolean;
        }
      ) => {
        const message = event.data.isUser
          ? userMessage(event.data)
          : botMessage(event.data);
        if (message.isStairs) {
          context.stairsMessages.push(message);
        } else {
          context.messages.push(message);
        }

        if (event.setActive && event.data.id) {
          context.activeMessageId = event.data.id;
        }
      },
      updateMessage: (
        context,
        event: {
          id: string;
          text: string;
          isStairs: boolean;
          context?: string;
        }
      ) => {
        const data = event.isStairs ? context.stairsMessages : context.messages;
        const message = data.find((m) => m.id === event.id);
        if (message && "text" in message) {
          message.text = event.text;
        }
        if (message && !message.isUser) {
          message.context = event.context;
        }
      },
      setStairsAnswered: (context, event: { value: boolean }) => {
        context.stairsAnswered = event.value;
      },

      setStairsReady: (context) => {
        context.stairsReady = true;
        context.stairsTimestamp = Date.now();
        context.stairsMessages.push({
          id: crypto.randomUUID(),
          isUser: false,
          text: context.stairsQuestion?.text ?? "",
        });
      },

      setStairsQuestion: (context, event: { data: StairsQuestion }) => {
        context.stairsQuestion = event.data;
        context.stairsReady = false;
      },
    }
  );
};

export type CreateUserMessageInput = {
  id?: string;
  text: string;
  isStairs: boolean;
  transform?: boolean;
};
export const userMessage = ({
  id,
  text,
  transform,
  isStairs,
}: CreateUserMessageInput): StoreMessage => ({
  id: id ?? crypto.randomUUID(),
  isUser: true,
  transform,
  isStairs,
  text,
});

export type CreateBotMessageInput = {
  id?: string;
  text: string;
  isStairs: boolean;
  transform?: boolean;
  node?: React.ReactNode;
  context?: string;
};
export const botMessage = ({
  id,
  text,
  isStairs,
  transform,
  node,
  context,
}: CreateBotMessageInput): StoreMessage => ({
  id: id ?? crypto.randomUUID(),
  isUser: false,
  isStairs,
  transform,
  text,
  node,
  context,
});

export const getHistory = (store: ChatStore) => {
  const snap = store.getSnapshot();

  return snap.context.messages.map((m) => ({
    agent: m.isUser ? "user" : "bot",
    text: m.text,
  }));
};

type Selector<T> = (_: SnapshotFromStore<ChatStore>) => T;

export const SelectStairsMessages: Selector<Message[]> = (state) =>
  state.context.stairsMessages;
export const SelectMessages: Selector<Message[]> = (state) =>
  state.context.messages;
export const SelectActiveMessageId: Selector<string | null> = (state) =>
  state.context.activeMessageId;
export const SelectStairsReady: Selector<boolean> = (state) =>
  state.context.stairsReady;
export const SelectStairsAnswered: Selector<boolean> = (state) =>
  state.context.stairsAnswered;
export const SelectStairsQuestion: Selector<StairsQuestion | null> = (state) =>
  state.context.stairsQuestion;
export const SelectStairsTimestamp: Selector<number | null> = (state) =>
  state.context.stairsTimestamp;
export const SelectOpen: Selector<boolean> = (state) => state.context.open;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Elements } from "@itell/constants";
import { type Message } from "@itell/core/chat";
import { Popover, PopoverContent, PopoverTrigger } from "@itell/ui/popover";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectOpen } from "@/lib/store/chat-store";
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
  const [isCompact, setIsCompact] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const expandedRectRef = useRef<DOMRect | null>(null);

  const checkOverlap = useCallback(() => {
    if (!triggerRef.current || !anchorRef.current) return;

    if (!expandedRectRef.current && !isCompact) {
      expandedRectRef.current = triggerRef.current.getBoundingClientRect();
      return;
    }

    const rectA = anchorRef.current.getBoundingClientRect();
    const rectB =
      expandedRectRef.current ?? triggerRef.current.getBoundingClientRect();

    const hasOverlap = !(
      rectA.right < rectB.left ||
      rectA.left > rectB.right ||
      rectA.bottom < rectB.top ||
      rectA.top > rectB.bottom
    );

    setIsCompact(hasOverlap);
  }, []);

  useEffect(() => {
    const anchor = document.getElementById(Elements.PAGE_ASSIGNMENTS);
    if (anchor) {
      anchorRef.current = anchor;
      checkOverlap();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        if (isIntersecting) {
          checkOverlap();
          window.addEventListener("resize", checkOverlap);
          window.addEventListener("scroll", checkOverlap);
        } else {
          window.removeEventListener("resize", checkOverlap);
          window.removeEventListener("scroll", checkOverlap);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    if (anchor) {
      observer.observe(anchor);
    }

    return () => {
      window.removeEventListener("resize", checkOverlap);
      window.removeEventListener("scroll", checkOverlap);
      observer.disconnect();
    };
  }, [checkOverlap]);

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        store.send({ type: "setOpen", value });
      }}
    >
      <PopoverTrigger
        ref={triggerRef}
        className={cn(
          "fixed bottom-12 right-8 z-30 border text-foreground",
          isCompact ? "rounded-full p-4" : "rounded-md bg-background px-6 py-4"
        )}
      >
        <motion.div className="flex items-center gap-2" layout>
          <MessageCircleIcon className="size-6" />
          {!isCompact && <span>Chat with AI</span>}
        </motion.div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-80 px-2 py-4 lg:w-96"
        sideOffset={8}
        align="end"
      >
        <div
          className="flex h-[50vh] flex-col"
          id={Elements.CHATBOT_CONTAINER}
          style={{
            height: "clamp(300px, 55vh, 800px)",
          }}
        >
          <ChatHeader />
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
      </PopoverContent>
    </Popover>
  );
}

function ChatHeader() {
  const store = useChatStore();

  return (
    <div
      className="mb-3 flex items-center justify-between gap-3 border-b p-3"
      aria-describedby="itell-ai-description"
    >
      <p id="itell-api-description" className="sr-only">
        ITELL AI is a chatbot that can answer your questions regarding the
        textbook content.
      </p>
      <div className="flex flex-col items-start text-sm">
        <p className="text-xs">Chat with</p>
        <div className="flex items-center gap-1.5">
          <p className="size-2 rounded-full bg-green-500" />
          <p className="font-medium">ITELL AI</p>
        </div>
      </div>
      <button
        onClick={() => {
          store.send({ type: "setOpen", value: false });
        }}
        aria-label="Close chat"
      >
        <XIcon className="size-6" />
      </button>
    </div>
  );
}

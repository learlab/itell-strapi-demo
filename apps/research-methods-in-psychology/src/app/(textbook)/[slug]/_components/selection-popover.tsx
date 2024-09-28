"use client";

import { useEffect, useRef, useState } from "react";

import { useAddChat, useChatStore } from "@/components/provider/page-provider";
import { getUserCondition } from "@/lib/auth/conditions";
import { Condition } from "@/lib/constants";
import { SelectOpen } from "@/lib/store/chat-store";
import { noteStore } from "@/lib/store/note-store";
import { DefaultPreferences, Elements } from "@itell/constants";
import { serializeRange } from "@itell/core/note";
import { Button } from "@itell/ui/button";
import { cn, getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { User } from "lucia";
import { PencilIcon, SparklesIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type Props = {
  pageSlug: string;
  user: User | null;
};

export const SelectionPopover = ({ user, pageSlug }: Props) => {
  const abort = new AbortController();
  const { signal } = abort;
  const { theme } = useTheme();
  const store = useChatStore();
  const open = useSelector(store, SelectOpen);
  const { action: addChat } = useAddChat();
  const target = useRef<HTMLElement | null>(null);

  const noteColor =
    theme === "light"
      ? (user?.preferences.note_color_light ??
        DefaultPreferences.note_color_light)
      : (user?.preferences.note_color_dark ??
        DefaultPreferences.note_color_dark);

  const askAction = {
    label: "Ask AI",
    icon: <SparklesIcon className="size-5" />,
    action: async () => {
      if (state) {
        if (!open) {
          store.send({ type: "setOpen", value: true });
        }
        const range = normalizeRange(state.range.cloneRange());
        const chunkSlug = findParentChunk(range);
        const content = range.cloneContents().textContent;

        const text = `Please explain the following:\n\n <blockquote>${content}</blockquote> `;
        addChat({ text, pageSlug, transform: true, currentChunk: chunkSlug });

        setTimeout(() => {
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }, 100);
      }
    },
  } as const;

  const takeNoteAction = {
    label: "Take Note",
    icon: <PencilIcon className="size-5" />,
    action: async () => {
      if (state && user) {
        const range = normalizeRange(state.range.cloneRange());
        const text = range.cloneContents().textContent as string;
        const chunkSlug = findParentChunk(range);
        noteStore.send({
          type: "create",
          id: randomNumber(),
          highlightedText: text,
          color: noteColor,
          chunkSlug,
          range: serializeRange(
            range,
            getChunkElement(chunkSlug, "data-chunk-slug") || undefined
          ),
        });
      }
    },
  };

  const isStairs = user
    ? getUserCondition(user, pageSlug) === Condition.STAIRS
    : false;
  const commands = isStairs ? [askAction, takeNoteAction] : [takeNoteAction];
  type cmd = (typeof commands)[number];
  const [pending, setPending] = useState<cmd["label"] | undefined>();

  const [state, setState] = useState<{
    top: number;
    left: number;
    range: Range;
  } | null>(null);

  const handler = (e: Event) => {
    const selection = window.getSelection();

    if (!selection?.rangeCount) {
      return setState(null);
    }

    const range = selection.getRangeAt(0);
    if (!range || range.collapsed) {
      return setState(null);
    }

    const el = range.commonAncestorContainer;
    if (!el || !target?.current?.contains(el)) {
      return setState(null);
    }

    const rect = range.getClientRects()[0];
    if (!rect) {
      return setState(null);
    }

    setState({
      top: rect.top + window.scrollY,
      left: rect.left,
      range,
    });
  };

  useEffect(() => {
    target.current = document.getElementById(Elements.PAGE_CONTENT);
    document.addEventListener("selectionchange", handler, { signal });
    window.addEventListener("resize", handler, { signal });

    return () => {
      abort.abort();
    };
  }, [pageSlug]);

  return (
    state &&
    createPortal(
      <div
        className={cn(
          "absolute -ml-[75px] flex flex-row items-center justify-between gap-2 rounded-md border-2 border-gray-100 bg-background px-2 py-1 shadow-sm"
        )}
        style={{
          left: `calc(${state.left}px + 4.6rem)`,
          top: `calc(${state.top}px - 4rem)`,
        }}
      >
        {commands.map((command) => (
          <Button
            variant="ghost"
            color="blue-gray"
            className="flex w-28 items-center gap-2 p-2"
            onClick={async (e) => {
              if (!user) {
                toast.warning("Please login to use this feature");
                return;
              }

              setPending(command.label);
              await command.action();
              setPending(undefined);
            }}
            key={command.label}
            pending={pending === command.label}
          >
            <span className="flex items-center gap-2">
              {command.icon}
              {command.label}
            </span>
          </Button>
        ))}
      </div>,
      document.body
    )
  );
};

const randomNumber = () => {
  const MIN_SERIAL = 1;
  const MAX_SERIAL = 2147483647;

  // Generate a random number within the SERIAL range
  return Math.floor(Math.random() * (MAX_SERIAL - MIN_SERIAL + 1)) + MIN_SERIAL;
};

const normalizeRange = (range: Range) => {
  const startNode = range.startContainer;
  const endNode = range.endContainer;

  // Snap to word boundaries
  if (startNode.nodeType === Node.TEXT_NODE) {
    const startOffset = range.startOffset;
    const startText = startNode.textContent;
    if (startText) {
      const wordStart = startText.lastIndexOf(" ", startOffset) + 1;
      range.setStart(startNode, wordStart);
    }
  }

  if (endNode.nodeType === Node.TEXT_NODE) {
    const endOffset = range.endOffset;
    const endText = endNode.textContent;
    if (endText) {
      const wordEnd = endText.indexOf(" ", endOffset);
      range.setEnd(endNode, wordEnd === -1 ? endText.length : wordEnd);
    }
  }

  return range;
};

function findParentChunk(range: Range) {
  let node: Node | null = range.commonAncestorContainer;

  // If the node is a text node, get its parent element
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }

  while (node && node !== document.body) {
    if (
      node instanceof HTMLElement &&
      node.classList.contains("content-chunk")
    ) {
      return node.dataset.chunkSlug as string;
    }
    node = node.parentElement;
  }

  return null;
}

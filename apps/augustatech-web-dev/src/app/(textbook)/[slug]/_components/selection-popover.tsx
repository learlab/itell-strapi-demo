"use client";
import { useAddChat, useChatStore } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { Condition } from "@/lib/constants";
import { SelectOpen } from "@/lib/store/chat-store";
import { noteStore } from "@/lib/store/note-store";
import { DefaultPreferences, Elements } from "@itell/constants";
import { serializeRange } from "@itell/core/note";
import { Button } from "@itell/ui/client";
import { cn, getChunkElement, getChunkSlug } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { User } from "lucia";
import { PencilIcon, SparklesIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type Props = {
	pageSlug: string;
	user: User | null;
};

export const SelectionPopover = ({ user, pageSlug }: Props) => {
	const { theme } = useTheme();
	const store = useChatStore();
	const open = useSelector(store, SelectOpen);
	const { action: addChat } = useAddChat();
	const noteColor =
		theme === "light"
			? user?.preferences.note_color_light ??
				DefaultPreferences.note_color_light
			: user?.preferences.note_color_dark ?? DefaultPreferences.note_color_dark;

	const askAction = {
		label: "Ask AI",
		icon: <SparklesIcon className="size-5" />,
		action: async () => {
			if (state) {
				if (!open) {
					store.send({ type: "setOpen", value: true });
				}
				const text = `Can you explain the following text\n\n"${state.text}"`;
				addChat({ text, pageSlug });
			}
		},
	} as const;

	const takeNoteAction = {
		label: "Take Note",
		icon: <PencilIcon className="size-5" />,
		action: async () => {
			if (state && user) {
				const chunkSlug = findParentChunk(state.range);
				noteStore.send({
					type: "create",
					id: randomNumber(),
					highlightedText: state.text,
					color: noteColor,
					chunkSlug,
					range: serializeRange(
						state.range,
						getChunkElement(chunkSlug) || undefined,
					),
				});
			}
		},
	};

	const commands =
		user?.condition === Condition.STAIRS
			? [askAction, takeNoteAction]
			: [takeNoteAction];
	type cmd = (typeof commands)[number];
	const [pending, setPending] = useState<cmd["label"] | undefined>();

	const [state, setState] = useState<{
		top: number;
		left: number;
		text: string;
		range: Range;
	} | null>(null);

	const handler = (e: Event) => {
		const selection = window.getSelection();
		const target = document.getElementById(Elements.PAGE_CONTENT);

		if (!selection?.rangeCount) {
			return setState(null);
		}

		const range = selection.getRangeAt(0);
		const text = range.cloneContents().textContent;
		if (!range || !text) {
			return setState(null);
		}

		const el = range.commonAncestorContainer;
		if (!el || !target?.contains(el)) {
			return setState(null);
		}

		const rect = range.getClientRects()[0];
		if (!rect) {
			return setState(null);
		}

		setState({
			top: rect.top + window.scrollY,
			left: rect.left,
			text,
			range,
		});
	};

	useEffect(() => {
		document.addEventListener("selectionchange", handler);
		window.addEventListener("resize", handler);

		return () => {
			document.removeEventListener("selectionchange", handler);
			window.removeEventListener("resize", handler);
		};
	}, []);

	return (
		state &&
		createPortal(
			<div
				className={cn(
					"absolute rounded-md shadow-sm  px-2 py-1 flex flex-row gap-2 border-2 border-gray-100 items-center justify-between bg-background -ml-[75px]",
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
						className="flex items-center gap-2 p-2 w-28"
						onClick={async () => {
							if (!user) {
								toast.warning("Please login to use this feature");
								return;
							}
							setPending(command.label);
							await command.action();
							setPending(undefined);
						}}
						key={command.label}
					>
						{pending === command.label ? (
							<Spinner className="size-4" />
						) : (
							command.icon
						)}
						{command.label}
					</Button>
				))}
			</div>,
			document.body,
		)
	);
};

const randomNumber = () => {
	const MIN_SERIAL = 1;
	const MAX_SERIAL = 2147483647;

	// Generate a random number within the SERIAL range
	return Math.floor(Math.random() * (MAX_SERIAL - MIN_SERIAL + 1)) + MIN_SERIAL;
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
			return getChunkSlug(node);
		}
		node = node.parentElement;
	}

	return null;
}

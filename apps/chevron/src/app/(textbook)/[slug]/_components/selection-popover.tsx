"use client";
import { useAddChat, useChat } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { useCreateNote } from "@/lib/store/note-store";
import { Elements } from "@itell/core/constants";
import { serializeRange } from "@itell/core/note";
import { cn } from "@itell/core/utils";
import { Button } from "@itell/ui/client";
import { User } from "lucia";
import { PencilIcon, SparklesIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { NoteData } from "./note/note-popover";

type Props = {
	pageSlug: string;
	user: User | null;
};

export const SelectionPopover = ({ user, pageSlug }: Props) => {
	const { theme } = useTheme();
	const createNote = useCreateNote();
	const setChatOpen = useChat((state) => state.setOpen);
	const { action: addChat } = useAddChat();

	const commands = [
		{
			label: "Ask AI",
			icon: <SparklesIcon className="size-5" />,
			action: async () => {
				if (state) {
					setChatOpen(true);
					const text = `Can you explain the following text\n\n"${state.text}"`;
					addChat({ text, pageSlug });
				}
			},
		},
		{
			label: "Take Note",
			icon: <PencilIcon className="size-5" />,
			action: async () => {
				if (state && user) {
					const noteColor =
						theme === "light"
							? user.preferences.note_color_light
							: user.preferences.note_color_dark;
					const newNote: NoteData = {
						id: randomNumber(),
						highlightedText: state.text,
						noteText: "",
						local: true,
						color: noteColor,
						range: serializeRange(state.range),
					};
					createNote(newNote);
				}
			},
		},
	] as const;
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

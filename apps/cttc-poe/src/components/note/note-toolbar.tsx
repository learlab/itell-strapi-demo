"use client";
import {
	defaultHighlightColor,
	useNoteColor,
} from "@/lib/hooks/use-note-color";
import { createNote } from "@/lib/note/actions";
import { useNotesStore } from "@/lib/store/note";
import { randomNumber } from "@/lib/utils";
import { serializeRange } from "@itell/core/note";
import { cn } from "@itell/core/utils";
import { CopyIcon, HighlighterIcon, PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Button } from "../client-components";

type Props = {
	pageSlug: string;
	userId: string | null;
};

export const NoteToolbar = ({ pageSlug, userId }: Props) => {
	const noteColor = useNoteColor();
	const { createNote: createNoteLocal, createHighlight: createHighlightLocal } =
		useNotesStore();

	const [state, setState] = useState<{
		top: number;
		left: number;
		text: string;
		range: Range;
	} | null>(null);
	const handler = (e: Event) => {
		const selection = window.getSelection();
		const target = document.getElementById("page-content");

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
			top: rect.top + window.scrollY - 60,
			left: rect.left + 75,
			text,
			range,
		});
	};

	const commands = [
		{
			label: "Note",
			icon: <PencilIcon className="size-5" />,
			action: async () => {
				if (state) {
					const id = randomNumber();
					createNoteLocal({
						id,
						y: state.top,
						highlightedText: state.text,
						color: noteColor,
						range: serializeRange(state.range),
					});
				}
			},
		},
		{
			label: "Highlight",
			icon: <HighlighterIcon className="size-5" />,
			action: async () => {
				if (state) {
					const id = randomNumber();
					const serializedRange = serializeRange(state.range);

					createHighlightLocal({
						id,
						color: defaultHighlightColor,
						range: serializedRange,
					});

					if (userId) {
						createNote({
							y: state.top,
							highlightedText: state.text,
							pageSlug,
							userId,
							color: defaultHighlightColor,
							range: serializedRange,
						});
					}
				}
			},
		},
		{
			label: "Copy",
			icon: <CopyIcon className="size-5" />,
			action: async () => {
				if (state) {
					await navigator.clipboard.writeText(state.text);
					toast.success("Copied to clipboard");
				}
			},
		},
	];

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
					"absolute rounded-md shadow-sm px-2 py-1 flex flex-row gap-2 border-2 border-gray-100 items-center justify-between bg-background -ml-[75px]",
				)}
				style={{ left: state.left, top: state.top }}
			>
				{commands.map((command) => (
					<Button
						variant="ghost"
						color="blue-gray"
						className="flex items-center gap-2 p-2"
						onClick={() => {
							if (!userId) {
								toast.warning("Please login to use this feature");
								return;
							}
							command.action();
						}}
						key={command.label}
					>
						{command.icon}
						{command.label}
					</Button>
				))}
			</div>,
			document.body,
		)
	);
};

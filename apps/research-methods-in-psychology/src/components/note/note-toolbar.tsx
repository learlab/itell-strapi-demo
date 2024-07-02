"use client";
import {
	defaultHighlightColor,
	useNoteColor,
} from "@/lib/hooks/use-note-color";
import { createNote } from "@/lib/note/actions";
import { useNotesStore } from "@/lib/store/note";
import { serializeRange } from "@itell/core/note";
import { cn } from "@itell/core/utils";
import { CopyIcon, HighlighterIcon, PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Button } from "../client-components";
import { Spinner } from "../spinner";

type Props = {
	pageSlug: string;
	userId: string | null;
};

export const NoteToolbar = ({ pageSlug, userId }: Props) => {
	const noteColor = useNoteColor();
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
					if (userId) {
						const serializedRange = serializeRange(state.range);
						const { noteId } = await createNote({
							y: state.top,
							highlightedText: state.text,
							pageSlug,
							userId,
							color: defaultHighlightColor,
							range: serializedRange,
						});

						createHighlightLocal({
							id: noteId,
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
	] as const;
	type cmd = (typeof commands)[number];
	const [pending, setPending] = useState<cmd["label"] | undefined>();
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
						className="flex items-center gap-2 p-2"
						onClick={async () => {
							if (!userId) {
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
	const array = new Uint32Array(1);
	window.crypto.getRandomValues(array);
	return array[0];
};

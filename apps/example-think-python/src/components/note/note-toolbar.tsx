"use client";

import { cn } from "@itell/core/utils";
import { HighlighterIcon, CopyIcon, PencilIcon } from "lucide-react";
import { Popover } from "react-text-selection-popover";
import { toast } from "sonner";
import { useTextSelection } from "use-text-selection";
import { trpc } from "@/trpc/trpc-provider";
import {
	defaultHighlightColor,
	useNoteColor,
} from "@/lib/hooks/use-note-color";
import { Button } from "../client-components";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createHighlightListeners, deleteHighlightListener } from "@/lib/note";
import { useNotesStore } from "@/lib/store";
import { createNoteElements, serializeRange } from "@itell/core/note";

type SelectionData = ReturnType<typeof useTextSelection>;

export const NoteToolbar = ({ chapter }: { chapter: number }) => {
	const [show, setShow] = useState(true);
	const [target, setTarget] = useState<HTMLElement | null>(null);
	const noteColor = useNoteColor();
	const { createNote, incrementHighlightCount, incrementNoteCount } =
		useNotesStore();
	const createHighlight = trpc.note.create.useMutation();
	const { data: session } = useSession();

	const handleClick = (event: Event) => {
		if (event.target instanceof HTMLElement) {
			if (
				event.target.tagName === "SPAN" ||
				event.target.classList.contains("cm-line") ||
				event.target.classList.contains("cm-editor") ||
				event.target.classList.contains("question-box-text")
			) {
				setShow(false);
			} else {
				setShow(true);
			}
		}
	};

	useEffect(() => {
		const el = document.getElementById("page-content") as HTMLElement;
		if (el) {
			setTarget(el);
			el.addEventListener("click", handleClick);
		}

		return () => {
			el.removeEventListener("click", handleClick);
		};
	}, []);

	const commands = [
		{
			label: "Note",
			icon: <PencilIcon className="w-5 h-5" />,
			action: async ({ clientRect, textContent }: SelectionData) => {
				if (!window.getSelection) {
					return toast.error("Your browser does not support taking notes");
				}
				const range = window.getSelection()?.getRangeAt(0);
				if (range && clientRect && textContent) {
					const id = crypto.randomUUID();
					const serializedRange = serializeRange(range);
					createNoteElements({
						id,
						range,
						color: noteColor,
					});

					createNote({
						id,
						y: clientRect.y + window.scrollY,
						highlightedText: textContent,
						color: noteColor,
						serializedRange,
					});

					incrementNoteCount();
				} else {
					toast.warning("Please select some text to take a note");
				}
			},
		},
		{
			label: "Highlight",
			icon: <HighlighterIcon className="w-5 h-5" />,
			action: async ({ clientRect, textContent }: SelectionData) => {
				if (!window.getSelection) {
					return toast.error("Your browser does not support taking notes");
				}
				const selection = window.getSelection();
				const range = selection?.getRangeAt(0);
				if (range && clientRect && textContent) {
					const id = crypto.randomUUID();
					const serializedRange = serializeRange(range);
					createNoteElements({
						id,
						range,
						color: defaultHighlightColor,
						isHighlight: true,
					});

					if (selection?.empty) {
						// Chrome
						selection?.empty();
					} else if (selection?.removeAllRanges) {
						// Firefox
						selection?.removeAllRanges();
					}

					await createHighlight.mutateAsync({
						id: id,
						y: clientRect.y + window.scrollY,
						highlightedText: textContent,
						chapter,
						color: defaultHighlightColor,
						range: serializedRange,
					});

					incrementHighlightCount();
					createHighlightListeners(id, (event) => {
						deleteHighlightListener(event);
						incrementHighlightCount(-1);
					});
				} else {
					toast.warning("Please select some text to take a note");
				}
			},
		},
		{
			label: "Copy",
			icon: <CopyIcon className="w-5 h-5" />,
			action: async ({ textContent }: SelectionData) => {
				if (textContent) {
					await navigator.clipboard.writeText(textContent);
					toast.success("Copied to clipboard");
				}
			},
		},
	];

	if (!target || !show) return null;

	return (
		<Popover
			target={target as HTMLElement}
			render={(data) => {
				const { clientRect, isCollapsed } = data;
				if (clientRect == null || isCollapsed) return null;

				const style = {
					left: `${clientRect.left + 75}px`,
					top: `${clientRect.top - 60}px`,
				};

				return (
					<div
						className={cn(
							"fixed rounded-md shadow-sm px-2 py-1 flex flex-row gap-2 border-2 border-gray-100 items-center justify-between bg-background -ml-[75px]",
						)}
						style={style}
					>
						{commands.map((command) => (
							<Button
								variant="ghost"
								color="blue-gray"
								className="flex items-center gap-2 p-2"
								onClick={() => {
									if (!session?.user && command.label !== "Copy") {
										return toast.warning("You need to be logged in first.");
									}
									command.action(data);
								}}
								key={command.label}
							>
								{command.icon}
								{command.label}
							</Button>
						))}
					</div>
				);
			}}
		/>
	);
};

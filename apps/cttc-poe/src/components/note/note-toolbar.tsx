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
import { Popover } from "react-text-selection-popover";
import { toast } from "sonner";
import { useTextSelection } from "use-text-selection";
import { Button } from "../client-components";

type SelectionData = ReturnType<typeof useTextSelection>;

type Props = {
	userId: string | null;
	pageSlug: string;
};

export const NoteToolbar = ({ pageSlug, userId }: Props) => {
	const [show, setShow] = useState(true);
	const [target, setTarget] = useState<HTMLElement | null>(null);
	const noteColor = useNoteColor();
	const { createNote: createNoteLocal, createHighlight: createHighlightLocal } =
		useNotesStore();

	const handleClick = (event: Event) => {
		if (document.body.classList.contains("focused-active")) {
			setShow(false);
			return;
		}
		if (
			!document.body.classList.contains("focused-active") &&
			event.target instanceof HTMLElement
		) {
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

	if (!userId) return null;

	const commands = [
		{
			label: "Note",
			icon: <PencilIcon className="size-5" />,
			action: async ({ clientRect, textContent }: SelectionData) => {
				if (!window.getSelection) {
					return toast.error("Your browser does not support taking notes");
				}
				const range = window.getSelection()?.getRangeAt(0);
				if (range && clientRect && textContent) {
					const id = randomNumber();
					createNoteLocal({
						id,
						y: clientRect.y + window.scrollY,
						highlightedText: textContent,
						color: noteColor,
						range: serializeRange(range),
					});
				} else {
					toast.warning("Please select some text to take a note");
				}
			},
		},
		{
			label: "Highlight",
			icon: <HighlighterIcon className="size-5" />,
			action: async ({ clientRect, textContent }: SelectionData) => {
				if (!window.getSelection) {
					return toast.error("Your browser does not support taking notes");
				}
				const selection = window.getSelection();
				const range = selection?.getRangeAt(0);
				if (range && clientRect && textContent) {
					const id = randomNumber();
					const serializedRange = serializeRange(range);

					if (selection?.empty) {
						// Chrome
						selection?.empty();
					} else if (selection?.removeAllRanges) {
						// Firefox
						selection?.removeAllRanges();
					}

					createHighlightLocal({
						id,
						color: defaultHighlightColor,
						range: serializedRange,
					});

					await createNote({
						y: clientRect.y + window.scrollY,
						highlightedText: textContent,
						pageSlug,
						userId,
						color: defaultHighlightColor,
						range: serializedRange,
					});
				} else {
					toast.warning("Please select some text to take a note");
				}
			},
		},
		{
			label: "Copy",
			icon: <CopyIcon className="size-5" />,
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
									if (!userId && command.label !== "Copy") {
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

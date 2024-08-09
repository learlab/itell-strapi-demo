"use client";

import {
	createNoteAction,
	deleteNoteAction,
	updateNoteAction,
} from "@/actions/note";
import { Spinner } from "@/components/spinner";
import { NoteData, noteStore } from "@/lib/store/note-store";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { TwitterPicker } from "@hello-pangea/color-picker";
import { useDebounce } from "@itell/core/hooks";
import {
	createNoteElements,
	deserializeRange,
	removeNotes,
	serializeRange,
} from "@itell/core/note";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Button,
	Label,
} from "@itell/ui/client";
import { cn, getChunkElement } from "@itell/utils";
import { PaletteIcon, StickyNoteIcon, TrashIcon } from "lucide-react";
import { ForwardIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import Textarea from "react-textarea-autosize";
import { toast } from "sonner";

interface Props extends NoteData {
	pageSlug: string;
}

export const NotePopover = React.memo(
	({
		id,
		highlightedText,
		noteText,
		pageSlug,
		chunkSlug,
		updatedAt,
		range,
		color,
		local = false,
	}: Props) => {
		const elements = useRef<HTMLElement[]>();
		const [positionFailed, setPositionFailed] = useState(
			local ? false : undefined,
		);
		const [noteColor, setNoteColor] = useState(color);
		const [anchor, setAnchor] = useState<HTMLElement | null>(null);
		const triggerRef = useRef<HTMLButtonElement>(null);
		const popoverRef = useRef<HTMLDivElement>(null);
		const textareaRef = useRef<HTMLTextAreaElement>(null);

		// used to compare the user input with the current note text
		const [text, setText] = useState(noteText);

		const getInput = useCallback(
			() => textareaRef.current?.value.trim() || "",
			[],
		);

		// this state is only used for focusing the textarea and does not control the popover state
		const [isPopoverOpen, setIsPopoverOpen] = useState(false);
		const [recordId, setRecordId] = useState<number | null>(local ? null : id);
		const [pending, setPending] = useState(false);
		const pendingDebounced = useDebounce(pending, 500);

		const shouldUpdate = !!recordId;
		const triggerId = `note-${id}-trigger`;
		const popoverId = `note-${id}-popover`;
		const anchorName = `note-${id}-anchor`;

		useEffect(() => {
			if (isPopoverOpen) {
				textareaRef.current?.focus();
			}
		}, [isPopoverOpen]);

		const handleDelete = async () => {
			setPending(true);
			popoverRef.current?.hidePopover();
			removeNotes(id);
			noteStore.send({ type: "delete", id });
			if (recordId) {
				// delete note in database
				await deleteNoteAction({ id: recordId });
				setPending(false);
			} else {
				setPending(false);
			}
		};

		const handleUpsert = async () => {
			setPending(true);

			const noteText = getInput();
			if (shouldUpdate) {
				if (recordId) {
					noteStore.send({
						type: "update",
						id,
						data: {
							noteText,
							color: noteColor,
						},
					});
					const [_, err] = await updateNoteAction({
						id: recordId,
						data: {
							noteText,
							color: noteColor,
						},
					});
					if (err) {
						return toast.error("Failed to update note");
					}
				}
			} else {
				const [data, err] = await createNoteAction({
					noteText,
					highlightedText,
					pageSlug,
					color: noteColor,
					chunkSlug,
					range,
				});
				if (err) {
					return toast.error("Failed to create note");
				}
				setRecordId(data.id);
			}
			setText(noteText);
			setPending(false);
		};

		useEffect(() => {
			const setup = async () => {
				try {
					const els = await createNoteElements({
						id,
						range: deserializeRange(
							range,
							getChunkElement(chunkSlug) || undefined,
						),
						color,
					});
					elements.current = els;
					setAnchor(els[els.length - 1]);
					setPositionFailed(false);
				} catch (err) {
					console.error(err);
					if (!chunkSlug) {
						setPositionFailed(true);
					} else {
						const chunk = getChunkElement(chunkSlug);
						if (chunk) {
							setAnchor(chunk);
						} else {
							setPositionFailed(true);
						}
					}
				}
			};

			setup();
		}, []);

		useEffect(() => {
			if (anchor && triggerRef.current) {
				const button = triggerRef.current;
				computePosition(anchor, button, {
					placement: "bottom-end",
					middleware: [flip(), shift({ padding: 5 }), offset(3)],
				}).then(({ x, y }) => {
					if (triggerRef.current) {
						button.style.left = `${x}px`;
						button.style.top = `${y}px`;
					}
				});

				if (popoverRef.current) {
					if (local) {
						popoverRef.current.showPopover();
					}
				}
			}
		}, [anchor]);

		useEffect(() => {
			if (anchor && triggerRef.current) {
				const handlePopoverToggle = (event: Event) => {
					if ((event as ToggleEvent).newState === "open") {
						setIsPopoverOpen(true);
					} else {
						setIsPopoverOpen(false);
						if (!pending && text !== getInput()) {
							handleUpsert();
						}
					}
				};
				if (popoverRef.current) {
					popoverRef.current.addEventListener("toggle", handlePopoverToggle);
				}

				return () => {
					if (popoverRef.current) {
						popoverRef.current.removeEventListener(
							"toggle",
							handlePopoverToggle,
						);
					}
				};
			}
		}, [anchor, recordId, pending, text]);

		useEffect(() => {
			if (elements.current) {
				elements.current.forEach((element) => {
					element.style.backgroundColor = noteColor;
				});
			}
		}, [noteColor]);

		if (positionFailed === undefined) {
			return null;
		}

		return (
			<div className="note-popover-container">
				<button
					id={triggerId}
					className={cn("note-trigger p-1", {
						"absolute z-10 ": !positionFailed,
					})}
					style={{
						// @ts-ignore
						anchorName,
						border: positionFailed ? `2px solid ${noteColor}` : undefined,
					}}
					type="button"
					aria-label="toggle note"
					popoverTarget={popoverId}
					ref={triggerRef}
				>
					{pendingDebounced ? (
						<Spinner className="size-4" />
					) : positionFailed ? (
						<span>Note</span>
					) : (
						<StickyNoteIcon className="fill-warning opacity-60 hover:fill-accent hover:opacity-100" />
					)}
				</button>
				<div
					id={popoverId}
					ref={popoverRef}
					popover="auto"
					role="tooltip"
					className="w-64 md:w-80 rounded-md bg-note-popover shadow-md hover:shadow-lg p-4 pb-2"
				>
					<form className="w-full">
						<Label>
							<span className="sr-only">note text</span>
							<Textarea
								name="input"
								defaultValue={noteText}
								ref={textareaRef}
								minRows={2}
								className="block w-full font-normal resize-none bg-inherit focus:outline-none"
							/>
						</Label>
						<footer className="flex justify-end gap-1">
							<ColorPicker
								id={id}
								color={noteColor}
								onChange={(value) => {
									setNoteColor(value);

									if (recordId) {
										updateNoteAction({
											id: recordId,
											data: { color: value },
										});
									}
								}}
							/>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<button
										type="button"
										className="p-2 hover:bg-muted/50"
										aria-label="delete note"
										onClick={() => popoverRef.current?.hidePopover()}
									>
										<TrashIcon className="size-3" />
									</button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you sure you want to delete this note?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel className="mt-0">
											Cancel
										</AlertDialogCancel>
										<Button
											disabled={pending}
											onClick={handleDelete}
											pending={pending}
										>
											Continue
										</Button>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>

							<button
								type="button"
								className="p-2 hover:bg-muted/50"
								aria-label="save note"
								onClick={handleUpsert}
							>
								<ForwardIcon className="size-3" />
							</button>
						</footer>
					</form>

					{!recordId ? (
						<p className="text-sm text-muted-foreground">unsaved</p>
					) : (
						<p className="text-sm text-muted-foreground">
							last updated at{" "}
							<time>
								{(updatedAt ? updatedAt : new Date()).toLocaleString()}
							</time>
						</p>
					)}
					{positionFailed && (
						<p className="text-sm text-muted-foreground">
							can't find reference text for this note
						</p>
					)}
				</div>
			</div>
		);
	},
);

type ColorPickerProps = {
	id: number;
	color: string;
	onChange: (color: string) => void;
};
const ColorPicker = ({ id, color, onChange }: ColorPickerProps) => {
	const colorPickerId = `color-picker-${id}`;
	const ref = useRef<HTMLDivElement>(null);

	return (
		<>
			<button
				type="button"
				className="p-2 hover:bg-muted/50"
				aria-label="change note color"
				popoverTarget={colorPickerId}
			>
				<PaletteIcon className="size-3" />
			</button>
			<div id={colorPickerId} popover="auto" role="tooltip" ref={ref}>
				<TwitterPicker
					color={color}
					onChange={(color) => {
						onChange(color.hex);
						ref.current?.hidePopover();
					}}
				/>
			</div>
		</>
	);
};

// unused anchor position style
/*
<style>
{`
	#${triggerId} {
		anchor-name: --${anchorName};
	}

	#${popoverId} {
		position-anchor: --${anchorName};
		inset: auto;
		inset-area: left span-bottom;
		position-try: flip-block;
	}
`}
</style>
*/

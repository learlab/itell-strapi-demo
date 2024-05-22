"use client";

import { createNote, deleteNote, updateNote } from "@/lib/note/actions";
import { useNotesStore } from "@/lib/store/note";
import { NoteCard as NoteCardType } from "@/types/note";
import { useClickOutside } from "@itell/core/hooks";
import {
	createNoteElements,
	deserializeRange,
	getElementsByNoteId,
} from "@itell/core/note";
import { cn, relativeDate } from "@itell/core/utils";
import { EditIcon } from "lucide-react";
import { ForwardIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { useFormStatus } from "react-dom";
import { useImmerReducer } from "use-immer";
import { Button, TextArea } from "../client-components";
import { Spinner } from "../spinner";
import { NoteDelete } from "./node-delete";
import NoteColorPicker from "./note-color-picker";

interface Props extends NoteCardType {
	pageSlug: string;
	newNote?: boolean;
}

type EditState = {
	color: string;
	editing: boolean;
	collapsed: boolean;
	showEdit: boolean;
	showDeleteModal: boolean;
	showColorPicker: boolean;
};

type EditDispatch =
	| { type: "collapse_note" }
	| { type: "toggle_collapsed" }
	| { type: "toggle_editing" }
	| { type: "set_show_edit"; payload: boolean }
	| { type: "set_editing"; payload: boolean }
	| { type: "set_show_delete_modal"; payload: boolean }
	| { type: "finish_delete" }
	| { type: "finish_upsert" }
	| { type: "set_color"; payload: string };

// existing notes are wrapped in <mark class = "highlight"> </mark>
// on mouse enter, add class = "emphasize"
// on delete add class = "unhighlighted"
// styles are in global.css
export const NoteCard = React.memo(
	({
		id,
		y,
		highlightedText,
		noteText,
		pageSlug,
		updated_at,
		created_at,
		range,
		color,
		newNote = false,
	}: Props) => {
		const elementsRef = useRef<HTMLElement[]>();
		const elements = elementsRef.current;
		const [shouldCreate, setShouldCreate] = useState(newNote);
		const [recordId, setRecordId] = useState<string | undefined>(
			newNote ? undefined : id,
		);

		const isUnsaved = !recordId;
		const [text, setText] = useState(noteText);

		const [editState, dispatch] = useImmerReducer<EditState, EditDispatch>(
			(draft, action) => {
				switch (action.type) {
					case "collapse_note":
						if (!draft.showDeleteModal) {
							draft.editing = false;
							draft.collapsed = true;
						}
						break;
					case "toggle_collapsed":
						draft.collapsed = !draft.collapsed;
						break;
					case "toggle_editing":
						draft.editing = !draft.editing;
						break;
					case "set_show_edit":
						draft.showEdit = action.payload;
						break;
					case "set_editing":
						draft.editing = action.payload;
						break;
					case "set_show_delete_modal":
						draft.showDeleteModal = action.payload;
						break;
					case "finish_delete":
						draft.showDeleteModal = false;
						draft.editing = false;
						break;
					case "finish_upsert":
						draft.editing = false;
						draft.collapsed = true;
						break;
					case "set_color":
						draft.color = action.payload;
						break;
				}
			},
			{
				color, // border color: ;
				editing: newNote, // true: show textarea, false: show noteText
				collapsed: !newNote, // if the note card is expanded
				showDeleteModal: false, // show delete modal
				showColorPicker: false, // show color picker
				showEdit: false, // show edit overlay
			},
		);
		const [isHidden, setIsHidden] = useState(false);
		const { deleteNote: deleteContextNote, updateNote: updateContextNote } =
			useNotesStore();

		const containerRef = useClickOutside<HTMLDivElement>(() => {
			dispatch({ type: "collapse_note" });
		});

		const formAction = async (data: FormData) => {
			const input = data.get("input") as string;
			setText(input);
			if (shouldCreate) {
				// create new note
				await createNote({
					id,
					y,
					noteText: input,
					highlightedText,
					pageSlug,
					color: editState.color,
					range,
				});
				setRecordId(id);
				setShouldCreate(false);
			} else {
				// edit existing note
				updateContextNote({ id, noteText: input });
				if (recordId) {
					await updateNote(recordId, { noteText: input });
				}
			}
			dispatch({ type: "finish_upsert" });
		};

		const emphasizeNote = (element: HTMLElement) => {
			element.classList.add("emphasized");
			element.style.fontStyle = "bold";
		};

		const deemphasizeNote = (element: HTMLElement) => {
			element.classList.remove("emphasized");
			element.style.fontStyle = "normal";
		};

		const unHighlightNote = (element: HTMLElement) => {
			element.classList.remove("emphasized");
			element.style.backgroundColor = "unset";
			element.classList.add("unhighlighted");
		};

		const handleDelete = async () => {
			if (elements) {
				elements.forEach(unHighlightNote);
			}
			setIsHidden(true);
			deleteContextNote(id);
			if (recordId) {
				// delete note in database
				await deleteNote(id);
			}
			dispatch({ type: "finish_delete" });
		};

		const triggers = {
			onMouseEnter: () => {
				if (editState.collapsed) {
					dispatch({ type: "set_show_edit", payload: true });
				}
				if (elements) {
					elements.forEach(emphasizeNote);
				}
			},
			onMouseLeave: () => {
				dispatch({ type: "set_show_edit", payload: false });

				if (elements) {
					elements.forEach(deemphasizeNote);
				}
			},
		};

		useEffect(() => {
			// if the note is loaded from the database, create the .note span elements
			// for new note, spans are created in note-toolbar.tsx
			if (!newNote) {
				try {
					setTimeout(() => {
						createNoteElements({
							id,
							range: deserializeRange(range),
							color,
						});
						// elementsRef should be set after the note elements are created
						// in the case of new note, they are already created by the toolbar
						elementsRef.current = Array.from(
							getElementsByNoteId(id) || [],
						) as HTMLElement[];
					}, 300);
				} catch (err) {
					console.error("create note element", err);
				}
			}
		}, []);

		const FormFooter = () => {
			const { pending } = useFormStatus();
			return (
				<footer className="mt-2">
					{isUnsaved && (
						<p className="text-sm text-muted-foreground">unsaved</p>
					)}
					<div className="flex justify-end gap-1">
						<NoteDelete
							open={editState.showDeleteModal}
							onOpenChange={(val) =>
								dispatch({
									type: "set_show_delete_modal",
									payload: val,
								})
							}
							onDelete={handleDelete}
						/>
						{editState.editing && (
							<Button
								disabled={pending}
								variant="ghost"
								size="sm"
								type="submit"
							>
								{pending ? <Spinner /> : <ForwardIcon className="size-4" />}
							</Button>
						)}
					</div>
				</footer>
			);
		};

		return (
			<div
				className={cn(
					"absolute w-full rounded-md border-2 bg-background",
					editState.collapsed ? "z-10" : "z-20",
					isHidden && "hidden",
				)}
				style={{
					top: y - 100,
					borderColor: editState.color,
				}}
				ref={containerRef}
				{...triggers}
			>
				<div className="relative">
					{/* edit icon overlay */}
					{editState.showEdit && (
						<button
							type="button"
							className="absolute left-0 top-0 w-full h-full bg-secondary/50 z-20 flex items-center justify-center"
							onClick={() => {
								dispatch({ type: "toggle_collapsed" });
								dispatch({ type: "set_show_edit", payload: false });
								// this is needed when a note is not saved
								// and the user clicked outside and clicked back again
								if (!id) {
									dispatch({ type: "set_editing", payload: true });
								} else {
									dispatch({ type: "set_editing", payload: false });
								}
							}}
						>
							<EditIcon />
						</button>
					)}

					<div className="font-light tracking-tight text-sm relative p-2">
						{editState.collapsed ? (
							<p className="line-clamp-3 text-sm mb-0">{text || "Note"}</p>
						) : (
							<div className="mt-1">
								<NoteColorPicker
									color={editState.color}
									onChange={(color) => {
										dispatch({ type: "set_color", payload: color });
										if (elements) {
											elements.forEach((element) => {
												element.style.backgroundColor = color;
											});
										}
										if (id) {
											updateNote(id, { color });
										}
									}}
								/>

								<form action={formAction}>
									{editState.editing ? (
										<TextArea
											placeholder="leave a note here"
											autoFocus
											autoHeight
											name="input"
											defaultValue={text}
										/>
									) : (
										<button
											type="button"
											onClick={() =>
												dispatch({ type: "set_editing", payload: true })
											}
											className="flex w-full text-left px-1 py-2 rounded-md hover:bg-accent"
										>
											<span className="mb-0">
												{text || <EditIcon className="size-4" />}
											</span>
										</button>
									)}
									<FormFooter />
								</form>

								{(updated_at || created_at) && (
									<p className="text-xs text-right mt-2 mb-0">
										updated at{" "}
										{relativeDate((updated_at || created_at) as Date)}
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	},
);

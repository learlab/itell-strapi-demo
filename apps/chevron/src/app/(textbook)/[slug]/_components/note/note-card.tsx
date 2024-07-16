"use client";

import { useSession } from "@/components/provider/session-provider";
import { Spinner } from "@/components/spinner";
import { createNote, deleteNote, updateNote } from "@/lib/note/actions";
import { useNotesStore } from "@/lib/store/note";
import { NoteCard as NoteCardType } from "@/lib/store/note";
import { useClickOutside } from "@itell/core/hooks";
import {
	createNoteElements,
	deserializeRange,
	getElementsByNoteId,
	removeNotes,
} from "@itell/core/note";
import { cn, relativeDate } from "@itell/core/utils";
import { Button, TextArea } from "@itell/ui/client";
import { EditIcon } from "lucide-react";
import { ForwardIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { useFormStatus } from "react-dom";
import { useImmerReducer } from "use-immer";
import { NoteDelete } from "./node-delete";
import NoteColorPicker from "./note-color-picker";

interface Props extends NoteCardType {
	pageSlug: string;
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
		updatedAt,
		createdAt,
		range,
		color,
		local = false,
	}: Props) => {
		const { user } = useSession();
		if (!user) {
			return null;
		}

		const elements = useRef<HTMLElement[]>();
		const [recordId, setRecordId] = useState<number | undefined>(
			local ? undefined : id,
		);
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
				color, // border color ;
				editing: local, // when editing show textarea otherwise show noteText
				collapsed: !local, // if the note card is expanded
				showDeleteModal: false, // show delete modal
				showColorPicker: false, // show color picker
				showEdit: false, // show edit overlay
			},
		);
		const [isHidden, setIsHidden] = useState(false);
		const { deleteNote: deleteNoteLocal, updateNote: updateNoteLocal } =
			useNotesStore();

		const containerRef = useClickOutside<HTMLDivElement>(() => {
			dispatch({ type: "collapse_note" });
		});

		const formAction = async (formData: FormData) => {
			const input = String(formData.get("input"));
			setText(input);
			if (!recordId) {
				// create new note
				const { noteId } = await createNote({
					y,
					userId: user.id,
					noteText: input,
					highlightedText,
					pageSlug,
					color: editState.color,
					range,
				});
				setRecordId(noteId);
			} else {
				// edit existing note
				updateNoteLocal(id, { noteText: input });
				if (recordId) {
					await updateNote(recordId, {
						noteText: input,
						color: editState.color,
					});
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

		const handleDelete = async () => {
			removeNotes(id);
			setIsHidden(true);
			deleteNoteLocal(id);
			if (recordId) {
				// delete note in database
				await deleteNote(recordId);
			}
			dispatch({ type: "finish_delete" });
		};

		const triggers = {
			onMouseEnter: () => {
				if (editState.collapsed) {
					dispatch({ type: "set_show_edit", payload: true });
				}
				if (elements) {
					elements.current?.forEach(emphasizeNote);
				}
			},
			onMouseLeave: () => {
				dispatch({ type: "set_show_edit", payload: false });

				if (elements) {
					elements.current?.forEach(deemphasizeNote);
				}
			},
		};

		useEffect(() => {
			// if the note is loaded from the database, create the .note span elements
			try {
				setTimeout(() => {
					createNoteElements({
						id,
						range: deserializeRange(range),
						color,
					});
					// elementsRef should be set after the note elements are created
					// in the case of new note, they are already created by the toolbar
					elements.current = Array.from(
						getElementsByNoteId(id) || [],
					) as HTMLElement[];
				}, 300);
			} catch (err) {
				console.error("create note element", err);
			}
		}, []);

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
										elements.current?.forEach((element) => {
											element.style.backgroundColor = color;
										});
										updateNoteLocal(id, { color });
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
									<NoteFooter
										id={recordId}
										isEditing={editState.editing}
										showDelete={editState.showDeleteModal}
										onDelete={handleDelete}
										onShowDelete={(val) =>
											dispatch({ type: "set_show_delete_modal", payload: val })
										}
									/>
								</form>

								{(updatedAt || createdAt) && (
									<p className="text-xs text-right mt-2 mb-0">
										updated at {relativeDate((updatedAt || createdAt) as Date)}
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

const NoteFooter = ({
	id,
	isEditing,
	showDelete,
	onShowDelete,
	onDelete,
}: {
	id: number | undefined;
	isEditing: boolean;
	showDelete: boolean;
	onShowDelete: (val: boolean) => void;
	onDelete: () => Promise<void>;
}) => {
	const { pending } = useFormStatus();
	return (
		<footer className="mt-2">
			{!id && <p className="text-sm text-muted-foreground">unsaved</p>}
			<div className="flex justify-end gap-1">
				<NoteDelete
					open={showDelete}
					onOpenChange={onShowDelete}
					onDelete={onDelete}
				/>
				{isEditing && (
					<Button disabled={pending} variant="ghost" size="sm" type="submit">
						{pending ? <Spinner /> : <ForwardIcon className="size-4" />}
					</Button>
				)}
			</div>
		</footer>
	);
};

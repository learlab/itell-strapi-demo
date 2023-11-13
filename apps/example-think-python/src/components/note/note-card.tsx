"use client";

import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { EditIcon } from "lucide-react";
import { NoteCard } from "@/types/note";
import { useClickOutside } from "@itell/core/hooks";
import { trpc } from "@/trpc/trpc-provider";
import NoteDelete from "./node-delete";
import { cn, relativeDate } from "@itell/core/utils";
import { ForwardIcon } from "lucide-react";
import Spinner from "../spinner";
import { useImmerReducer } from "use-immer";
import NoteColorPicker from "./note-color-picker";
import { Button, TextArea } from "../client-components";
import { useNotesStore } from "@/lib/store";
import { usePython } from "@/lib/hooks/ues-python";
import {
	createNoteElements,
	deserializeRange,
	getElementsByNoteId,
} from "@itell/core/note";

interface Props extends NoteCard {
	chapter: number;
	newNote?: boolean;
}

type EditState = {
	input: string;
	color: string;
	editing: boolean;
	collapsed: boolean;
	showEdit: boolean;
	showDeleteModal: boolean;
	showColorPicker: boolean;
};

type EditDispatch =
	| { type: "set_input"; payload: string }
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
export default function ({
	id,
	y,
	highlightedText,
	noteText,
	chapter,
	updated_at,
	created_at,
	serializedRange,
	color,
	newNote = false,
}: Props) {
	const elementsRef = useRef<HTMLElement[]>();
	const elements = elementsRef.current;
	const { isReady } = usePython();
	const [shouldCreate, setShouldCreate] = useState(newNote);
	const [recordId, setRecordId] = useState<string>(newNote ? "" : id);
	const [editState, dispatch] = useImmerReducer<EditState, EditDispatch>(
		(draft, action) => {
			switch (action.type) {
				case "set_input":
					draft.input = action.payload;
					break;
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
			input: noteText, // textarea input
			color, // border color: ;
			editing: newNote, // true: show textarea, false: show noteText
			collapsed: !newNote, // if the note card is expanded
			showDeleteModal: false, // show delete modal
			showColorPicker: false, // show color picker
			showEdit: false, // show edit overlay
		},
	);
	const [isHidden, setIsHidden] = useState(false);
	const {
		deleteNote: deleteContextNote,
		updateNote: updateContextNote,
		incrementNoteCount,
	} = useNotesStore();
	const updateNote = trpc.note.update.useMutation({
		onSuccess: () => {
			dispatch({ type: "finish_upsert" });
		},
	});
	const createNote = trpc.note.create.useMutation({
		onSuccess: () => {
			dispatch({ type: "finish_upsert" });
		},
	});
	const deleteNote = trpc.note.delete.useMutation();
	const containerRef = useClickOutside<HTMLDivElement>(() => {
		dispatch({ type: "collapse_note" });
	});

	const isUnsaved = !id || editState.input !== noteText;
	const isLoading =
		updateNote.isLoading || createNote.isLoading || deleteNote.isLoading;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (shouldCreate) {
			// create new note
			await createNote.mutateAsync({
				id,
				y,
				noteText: editState.input,
				highlightedText,
				chapter,
				color: editState.color,
				range: serializedRange,
			});
			setRecordId(id);
			setShouldCreate(false);
		} else {
			// edit existing note
			updateContextNote({ id, noteText: editState.input });
			await updateNote.mutateAsync({
				id: recordId,
				noteText: editState.input,
			});
		}
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
		incrementNoteCount(-1);
		if (id) {
			// delete note in database
			deleteContextNote(id);
			await deleteNote.mutateAsync({ id });
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
				createNoteElements({
					id,
					range: deserializeRange(serializedRange),
					color,
				});
			} catch (err) {
				console.error("create note element", err);
			}
		}

		// elementsRef should be set after the note elements are created
		// in the case of new note, they are already created by the toolbar
		elementsRef.current = Array.from(
			getElementsByNoteId(id) || [],
		) as HTMLElement[];
	}, []);

	return (
		<Fragment>
			<div
				className={cn(
					"absolute w-full rounded-md border-2 bg-background",
					editState.collapsed ? "z-10" : "z-50",
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
							className="absolute left-0 top-0 w-full h-full bg-secondary/50 z-50 flex items-center justify-center"
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
							<p className="line-clamp-3 text-sm mb-0">
								{editState.input || "Note"}
							</p>
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
											updateNote.mutate({ id, color });
										}
									}}
								/>

								{editState.editing ? (
									<form>
										<TextArea
											placeholder="leave a note here"
											value={editState.input}
											onValueChange={(val) =>
												dispatch({ type: "set_input", payload: val })
											}
											autoFocus
											autoHeight
										/>
									</form>
								) : (
									<button
										onClick={() =>
											dispatch({ type: "set_editing", payload: true })
										}
										className="flex w-full text-left px-1 py-2 rounded-md hover:bg-accent"
									>
										<span className="mb-0">
											{editState.input || <EditIcon className="w-4 h-4" />}
										</span>
									</button>
								)}
								<footer className="mt-2">
									{isUnsaved && (
										<p className="text-sm text-muted-foreground">unsaved</p>
									)}
									<div className="flex justify-end">
										{!isLoading && (
											<NoteDelete
												onDelete={handleDelete}
												onOpen={() => {
													dispatch({
														type: "set_show_delete_modal",
														payload: true,
													});
												}}
											/>
										)}
										{editState.editing && (
											<Button
												disabled={isLoading}
												variant="ghost"
												size="sm"
												onClick={handleSubmit}
											>
												{updateNote.isLoading || createNote.isLoading ? (
													<Spinner />
												) : (
													<ForwardIcon className="w-4 h-4" />
												)}
											</Button>
										)}
									</div>
								</footer>
								{/* {(updated_at || created_at) && (
									<p className="text-xs text-right mt-2 mb-0">
										updated at{" "}
										{relativeDate((updated_at || created_at) as Date)}
									</p>
								)} */}
							</div>
						)}
					</div>
				</div>
			</div>
		</Fragment>
	);
}

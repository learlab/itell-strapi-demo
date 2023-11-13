"use client";

import { useNotesStore } from "@/lib/store";
import NoteCard from "./note-card";

export const NewNoteList = ({ chapter }: { chapter: number }) => {
	const notes = useNotesStore((store) => store.notes);

	return notes.map((note) => (
		<NoteCard key={note.id} {...note} chapter={chapter} newNote={true} />
	));
};

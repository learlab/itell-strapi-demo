"use client";

import { useNotesStore } from "@/lib/store";
import { NoteCard } from "./note-card";

type Props = {
	pageSlug: string;
};

export const NewNoteList = ({ pageSlug }: Props) => {
	const notes = useNotesStore((store) => store.notes);

	return notes.map((note) => (
		<NoteCard key={note.id} {...note} pageSlug={pageSlug} newNote={true} />
	));
};

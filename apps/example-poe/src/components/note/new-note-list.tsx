"use client";

import { useNotesStore } from "@/lib/store";
import NoteCard from "./note-card";
import { SectionLocation } from "@/types/location";

export const NewNoteList = ({ location }: { location: SectionLocation }) => {
	const notes = useNotesStore((store) => store.notes);

	return notes.map((note) => (
		<NoteCard key={note.id} {...note} location={location} newNote={true} />
	));
};

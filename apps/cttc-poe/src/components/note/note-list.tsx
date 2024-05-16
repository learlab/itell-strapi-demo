"use client";

import { useNotesStore } from "@/lib/store/note";
import { deserializeRange } from "@itell/core/note";
import { Note } from "@prisma/client";
import { Highlight } from "./highlight";
import { NoteCard } from "./note-card";

type Props = {
	notes: Note[];
	highlights: Note[];
	pageSlug: string;
};

export const NoteList = ({ notes, highlights, pageSlug }: Props) => {
	const { notes: newNotes, highlights: newHighlights } = useNotesStore();

	return (
		<>
			{notes.map((note) => (
				<NoteCard
					key={note.y}
					{...note}
					noteText={note.noteText || ""}
					pageSlug={pageSlug}
				/>
			))}
			{highlights.map((highlight) => (
				<Highlight key={highlight.y} {...highlight} />
			))}
			{newNotes.map((note) => (
				<NoteCard key={note.id} {...note} pageSlug={pageSlug} newNote={true} />
			))}
			{newHighlights.map((highlight) => (
				<Highlight key={highlight.id} {...highlight} />
			))}
		</>
	);
};

"use client";

import { Note } from "@/drizzle/schema";
import { useNotesStore } from "@/lib/store/note";
import { useEffect } from "react";
import { Highlight } from "./highlight";
import { NoteCard } from "./note-card";

type Props = {
	data: { notes: Note[]; highlights: Note[] };
	pageSlug: string;
};

export const NoteList = ({ data, pageSlug }: Props) => {
	const { init, notes, highlights } = useNotesStore();

	useEffect(() => {
		init(data.notes, data.highlights);
	}, []);

	return (
		<>
			{notes.map((note) => (
				<NoteCard
					key={note.id}
					{...note}
					noteText={note.noteText || ""}
					pageSlug={pageSlug}
				/>
			))}
			{highlights.map((highlight) => (
				<Highlight key={highlight.id} {...highlight} />
			))}
		</>
	);
};

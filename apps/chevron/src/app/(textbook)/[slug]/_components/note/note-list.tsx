"use client";

import { Note } from "@/drizzle/schema";
import { useInitNotes, useNotes } from "@/lib/store/note-store";
import { useEffect } from "react";
import { NotePopover } from "./note-popover";

type Props = {
	notes: Note[];
	pageSlug: string;
};

export const NoteList = ({ notes, pageSlug }: Props) => {
	const init = useInitNotes();
	const data = useNotes();

	useEffect(() => {
		init(notes);
	}, [notes]);

	if (data) {
		return (
			<div className="note-list flex flex-row gap-2">
				<p className="sr-only">list of notes</p>
				{data.map((note) => (
					<NotePopover
						key={note.id}
						local={false}
						{...note}
						pageSlug={pageSlug}
					/>
				))}
			</div>
		);
	}

	return null;
};

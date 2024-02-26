import { NoteCard } from "./note-card";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { Highlight } from "./highlight";
import { NewNoteList } from "./new-note-list";

type Props = {
	pageSlug: string;
};

export const NoteList = async ({ pageSlug }: Props) => {
	const user = await getCurrentUser();
	if (!user) {
		return null;
	}

	const notesAndHighlights = await db.note.findMany({
		where: {
			userId: user.id,
			pageSlug,
		},
	});
	const notes = notesAndHighlights.filter((note) => note.noteText !== null);
	const highlights = notesAndHighlights.filter(
		(note) => note.noteText === null,
	);

	return (
		<div>
			{notes.map((note) => (
				// @ts-ignore
				<NoteCard key={note.y} {...note} pageSlug={pageSlug} />
			))}
			{highlights.map((highlight) => (
				<Highlight key={highlight.y} {...highlight} />
			))}
			<NewNoteList pageSlug={pageSlug} />
		</div>
	);
};

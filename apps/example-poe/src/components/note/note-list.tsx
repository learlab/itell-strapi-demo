import NoteCard from "./note-card";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { Highlight } from "./highlight";
import { NewNoteList } from "./new-note-list";

export const NoteList = async ({ chapter }: { chapter: number }) => {
	const user = await getCurrentUser();
	if (!user) {
		return null;
	}

	const notesAndHighlights = await db.note.findMany({
		where: {
			userId: user.id,
			chapter,
		},
	});
	const notes = notesAndHighlights.filter((note) => Boolean(note.noteText));
	const highlights = notesAndHighlights.filter(
		(note) => note.noteText === null,
	);

	return (
		<div>
			{notes.map((note) => (
				// @ts-ignore noteText will not be null
				<NoteCard
					key={note.id}
					{...note}
					serializedRange={note.range}
					chapter={chapter}
					newNote={false}
				/>
			))}
			{highlights.map((highlight) => (
				<Highlight key={highlight.id} {...highlight} />
			))}
			{/* for rendering notes that are newly created */}
			<NewNoteList chapter={chapter} />
		</div>
	);
};

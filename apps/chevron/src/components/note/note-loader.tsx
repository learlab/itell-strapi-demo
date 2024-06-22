import { getNotes } from "@/lib/note";
import { NoteList } from "./note-list";

type Props = {
	userId: string | null;
	pageSlug: string;
};

export const NoteLoader = async ({ userId, pageSlug }: Props) => {
	if (!userId) {
		return null;
	}
	const notesAndHighlights = await getNotes(userId, pageSlug);
	const notes = notesAndHighlights.filter((note) => note.noteText !== null);
	const highlights = notesAndHighlights.filter(
		(note) => note.noteText === null,
	);

	return <NoteList data={{ notes, highlights }} pageSlug={pageSlug} />;
};

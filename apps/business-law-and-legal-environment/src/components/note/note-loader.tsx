import { getCurrentUser } from "@/lib/auth";
import { getNotes } from "@/lib/server-actions";
import { NoteList } from "./note-list";

type Props = {
	pageSlug: string;
};

export const NoteLoader = async ({ pageSlug }: Props) => {
	const user = await getCurrentUser();
	if (!user) {
		return null;
	}

	const notesAndHighlights = await getNotes(pageSlug);
	const notes = notesAndHighlights.filter((note) => note.noteText !== null);
	const highlights = notesAndHighlights.filter(
		(note) => note.noteText === null,
	);

	return <NoteList notes={notes} highlights={highlights} pageSlug={pageSlug} />;
};

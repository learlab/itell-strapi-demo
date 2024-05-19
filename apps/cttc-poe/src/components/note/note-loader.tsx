import { getSession } from "@/lib/auth";
import { getNotes } from "@/lib/note";
import { NoteList } from "./note-list";

type Props = {
	pageSlug: string;
};

export const NoteLoader = async ({ pageSlug }: Props) => {
	const { user } = await getSession();
	if (!user) {
		return null;
	}

	const notesAndHighlights = await getNotes(user.id, pageSlug);
	const notes = notesAndHighlights.filter((note) => note.noteText !== null);
	const highlights = notesAndHighlights.filter(
		(note) => note.noteText === null,
	);

	return <NoteList notes={notes} highlights={highlights} pageSlug={pageSlug} />;
};

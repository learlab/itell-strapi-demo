import { getNotesAction } from "@/actions/note";
import { NoteList } from "./note-list";

type Props = {
	pageSlug: string;
};

export const NoteLoader = async ({ pageSlug }: Props) => {
	const [data, err] = await getNotesAction({ pageSlug });
	if (!err) {
		const notes = data.filter((note) => note.noteText !== null);
		const highlights = data.filter((note) => note.noteText === null);

		return <NoteList data={{ notes, highlights }} pageSlug={pageSlug} />;
	}

	return null;
};

import { getSessionUser } from "../auth";
import db from "../db";

export const getNotes = async (pageSlug: string) => {
	const user = await getSessionUser();
	if (!user) {
		return [];
	}

	return await db.note.findMany({
		where: {
			userId: user.id,
			pageSlug,
		},
	});
};

export const countNoteHighlight = async (pageSlug: string) => {
	const user = await getSessionUser();
	if (!user) {
		return [];
	}

	return (await db.$queryRaw`
			SELECT COUNT(*),
					CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END as type
			FROM notes
			WHERE user_id = ${user.id} AND page_slug = ${pageSlug}
			GROUP BY CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END`) as {
		count: number;
		type: string;
	}[];
};

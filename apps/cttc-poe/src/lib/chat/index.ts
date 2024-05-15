import { getSessionUser } from "../auth";
import db from "../db";

export const getChatMessages = async (pageSlug: string) => {
	const user = await getSessionUser();
	if (user) {
		const record = await db.chatMessage.findUnique({
			select: {
				data: true,
				updated_at: true,
			},
			where: {
				userId_pageSlug: {
					userId: user.id,
					pageSlug,
				},
			},
		});

		if (record) {
			return {
				updatedAt: record.updated_at,
				data: record.data,
			};
		}
	}

	return {
		updatedAt: new Date(),
		data: [],
	};
};

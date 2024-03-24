"use server";

import { getCurrentUser } from "../auth";
import db from "../db";

type CreateMesage = {
	pageSlug: string;
	messages: PrismaJson.ChatMessageData[];
};

export const createChatMessage = async ({
	pageSlug,
	messages,
}: CreateMesage) => {
	const user = await getCurrentUser();
	if (user) {
		const record = await db.chatMessage.findUnique({
			select: {
				data: true,
			},
			where: {
				userId_pageSlug: {
					userId: user.id,
					pageSlug,
				},
			},
		});

		if (!record) {
			await db.chatMessage.create({
				data: {
					pageSlug,
					userId: user.id,
					data: messages,
				},
			});
		} else {
			const newData = [...record.data, ...messages];
			await db.chatMessage.update({
				where: {
					userId_pageSlug: {
						userId: user.id,
						pageSlug,
					},
				},
				data: {
					data: newData,
				},
			});
		}
	}
};

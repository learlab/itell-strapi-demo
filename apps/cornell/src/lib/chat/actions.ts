"use server";

import { getCurrentUser } from "../auth";
import db from "../db";

export const createChatMessage = async ({
	pageSlug,
	userText,
	botText,
}: {
	pageSlug: string;
	userText: string;
	botText: string;
}) => {
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

		const userMessage = {
			isUser: true,
			text: userText,
		};
		const botMessage = {
			isUser: false,
			text: botText,
		};
		if (!record) {
			await db.chatMessage.create({
				data: {
					pageSlug,
					userId: user.id,
					data: [userMessage, botMessage],
				},
			});
		} else {
			const newData = [...record.data, userMessage, botMessage];
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

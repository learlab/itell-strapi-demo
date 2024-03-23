"use server";

import { getCurrentUser } from "../auth";
import db from "../db";

type CreateMesage = {
	isStairs: boolean;
	pageSlug: string;
	userText: string;
	userTimestamp: number;
	botText: string;
	botTimestamp: number;
};

export const createChatMessage = async ({
	pageSlug,
	userText,
	userTimestamp,
	botText,
	botTimestamp,
	isStairs,
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

		const userMessage: PrismaJson.ChatMessageData = {
			isUser: true,
			text: userText,
			isStairs,
			timestamp: userTimestamp,
		};
		const botMessage: PrismaJson.ChatMessageData = {
			isUser: false,
			text: botText,
			isStairs,
			timestamp: botTimestamp,
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

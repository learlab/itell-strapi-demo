"use server";

import { ChatMessageData, chat_messages } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { db, first } from "../db";

type CreateMessage = {
	userId: string;
	pageSlug: string;
	messages: ChatMessageData[];
};

export const createChatMessage = async ({
	userId,
	pageSlug,
	messages,
}: CreateMessage) => {
	const record = first(
		await db
			.select()
			.from(chat_messages)
			.where(
				and(
					eq(chat_messages.userId, userId),
					eq(chat_messages.pageSlug, pageSlug),
				),
			),
	);

	if (!record) {
		await db.insert(chat_messages).values({
			pageSlug,
			userId,
			data: messages,
		});
	} else {
		const newData = [...record.data, ...messages];
		await db
			.update(chat_messages)
			.set({ data: newData })
			.where(
				and(
					eq(chat_messages.userId, userId),
					eq(chat_messages.pageSlug, pageSlug),
				),
			);
	}
};

"use server";

import { cookies } from "next/headers";

export const setCurrentChunk = (pageSlug: string, currentChunk: string) => {
	const data = cookies().get("user_current_chunk");
	const current = data
		? (JSON.parse(data.value) as Record<string, string>)
		: {};
	current[pageSlug] = currentChunk;
	cookies().set("user_current_chunk", JSON.stringify(current));
};

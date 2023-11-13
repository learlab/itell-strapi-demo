import { env } from "@/env.mjs";
import { SummaryResponseSchema } from "@/trpc/schema";
import { TEXTBOOK_NAME } from "./constants";

export const getScore = async ({
	input,
	chapter,
}: { input: string; chapter: number }) => {
	const response = await fetch(`${env.NEXT_PUBLIC_SCORE_API_URL}/summary`, {
		method: "POST",
		body: JSON.stringify({
			summary: input,
			chapter_index: chapter,
			textbook_name: TEXTBOOK_NAME,
			section_index: null,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();
	return SummaryResponseSchema.safeParse(data);
};

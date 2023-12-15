import { env } from "@/env.mjs";
import { SummaryResponse, SummaryResponseSchema } from "@itell/core/summary";
import { TEXTBOOK_NAME } from "./constants";

// for returning something when AI feedback is not enabled
export const createEmptyScore = (): SummaryResponse => ({
	included_keyphrases: [],
	suggested_keyphrases: [],
	content: -1,
	wording: -1,
	similarity: -1,
	containment: -1,
});

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

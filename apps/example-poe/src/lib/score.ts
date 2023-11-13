import { env } from "@/env.mjs";
import { SummaryResponseSchema } from "@/trpc/schema";
import { SectionLocation } from "@/types/location";
import { TEXTBOOK_NAME } from "./constants";

export const getScore = async ({
	input,
	location,
}: { input: string; location: SectionLocation }) => {
	const response = await fetch(`${env.NEXT_PUBLIC_SCORE_API_URL}/summary`, {
		method: "POST",
		body: JSON.stringify({
			textbook_name: TEXTBOOK_NAME,
			summary: input,
			chapter_index: location.chapter,
			section_index: location.section,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();
	return SummaryResponseSchema.safeParse(data);
};

import { env } from "@/env.mjs";
import { TEXTBOOK_NAME } from "./constants";
import { QAScoreSchema } from "@/trpc/schema";
import db from "./db";

export const getPageQuestions = async (pageId: string) => {
	return await db.subSection.findMany({
		where: {
			sectionId: pageId,
			NOT: {
				question: {
					equals: null,
				},
			},
		},
		select: {
			sectionId: true,
			slug: true,
			subsection: true,
			question: true,
			answer: true,
		},
	});
};
// async function to get QA scores from scoring API
export const getQAScore = async ({
	input,
	chunk_slug,
	page_slug,
}: { input: string; chunk_slug: string; page_slug: string }) => {
	const response = await fetch(`${env.NEXT_PUBLIC_SCORE_API_URL}/answer`, {
		cache: "no-store",
		method: "POST",
		body: JSON.stringify({
			page_slug:page_slug,
			chunk_slug:chunk_slug,
			answer: input,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	console.log(response);
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	if (!data) {
		throw new Error('Empty response');
	}
	return QAScoreSchema.safeParse(data);
};

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
	if(page_slug == null){
		page_slug = "temp page slug";
	}
	if(chunk_slug == null){
		chunk_slug = "temp chunk slug";
	}
	const response = await fetch(`${env.NEXT_PUBLIC_SCORE_API_URL}/answer`, {
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
	const data = await response.json();
	return QAScoreSchema.safeParse(data);
};

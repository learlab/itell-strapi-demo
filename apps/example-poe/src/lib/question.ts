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
	chapter,
	section,
	subsection,
}: { input: string; chapter: string; section: string; subsection: string }) => {
	const response = await fetch(`${env.NEXT_PUBLIC_SCORE_API_URL}/answer`, {
		method: "POST",
		body: JSON.stringify({
			textbook_name: TEXTBOOK_NAME,
			chapter_index: chapter,
			section_index: section,
			subsection_index: subsection,
			answer: input,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await response.json();
	return QAScoreSchema.safeParse(data);
};

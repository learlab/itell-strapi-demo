import db from "./db";
import { env } from "@/env.mjs";
import { TEXTBOOK_NAME } from "./constants";
import { QAScoreSchema } from "@itell/core/qa";

// async function to get QA scores from scoring API
export const getQAScore = async ({
	input,
	chapter,
	subsection,
}: { input: string; chapter: string; subsection: string }) => {
	const response = await fetch(`${env.NEXT_PUBLIC_SCORE_API_URL}/answer`, {
		method: "POST",
		body: JSON.stringify({
			textbook_name: TEXTBOOK_NAME,
			chapter_index: chapter,
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

export const getPageQuestions = async (pageId: string) => {
	return await db.subSection.findMany({
		where: {
			sectionId: pageId,
			NOT: [
				{
					question: null,
				},
				{
					question: "",
				},
			],
		},
		select: {
			sectionId: true,
			subsection: true,
			question: true,
			slug: true,
			answer: true,
		},
	});
};

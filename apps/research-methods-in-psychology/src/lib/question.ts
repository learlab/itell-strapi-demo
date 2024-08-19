import { TEXTBOOK_SLUG } from "@/config/site";
import { ScoreSchema } from "@itell/core/question";
import qs from "qs";
import { z } from "zod";

export const QuestionSchema = z.object({
	question: z.string(),
	answer: z.string(),
});
export type Question = z.infer<typeof QuestionSchema>;

const PageQuestionsSchema = z.object({
	data: z.array(
		z.object({
			attributes: z.object({
				Content: z.array(
					z.object({
						Slug: z.string(),
						QuestionAnswerResponse: z.string().nullable(),
					}),
				),
			}),
		}),
	),
});

// async function to get QA scores from scoring API
export const getQAScore = async ({
	input,
	chunk_slug,
	page_slug,
}: { input: string; chunk_slug: string; page_slug: string }) => {
	const response = await fetch("/api/itell/score/answer", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			pageSlug: page_slug,
			chunkSlug: chunk_slug,
			answer: input,
		}),
	});

	const data = await response.json();
	return ScoreSchema.parse(data);
};

export const getAllQuestions = async () => {
	const q = qs.stringify({
		filters: {
			Volume: {
				Slug: {
					$eq: TEXTBOOK_SLUG,
				},
			},
		},
		populate: {
			Content: {
				on: {
					"page.chunk": {
						fields: ["QuestionAnswerResponse", "Slug"],
						populate: "*",
					},
				},
			},
		},
	});

	const endpoint = `https://itell-strapi-um5h.onrender.com/api/pages?${q}`;
	try {
		const response = await (await fetch(endpoint)).json();
		const parsed = PageQuestionsSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Failed to parse response", parsed.error);
		}

		return parsed.data;
	} catch (e) {
		console.error("Failed to fetch page questions", e);
		return null;
	}
};

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

export type SelectedQuestions = Map<string, Question>;
export const getRandomPageQuestions = async (pageSlug: string) => {
	const chunks = (await getPageChunks(pageSlug))?.filter(
		(c) => c.QuestionAnswerResponse !== null,
	) as { Slug: string; QuestionAnswerResponse: string }[];
	const selectedQuestions: SelectedQuestions = new Map();

	if (chunks && chunks.length > 0) {
		if (chunks.length > 0) {
			chunks.forEach((chunk) => {
				if (Math.random() < 1 / 3) {
					const parsed = JSON.parse(chunk.QuestionAnswerResponse);
					const questionParsed = QuestionSchema.safeParse(parsed);
					if (questionParsed.success) {
						selectedQuestions.set(chunk.Slug, questionParsed.data);
					}
				}
			});

			// Each page will have at least one question
			if (selectedQuestions.size === 0) {
				const randChunk = Math.floor(Math.random() * (chunks.length - 1));
				const chunk = chunks[randChunk];
				const parsed = JSON.parse(chunk.QuestionAnswerResponse);
				const questionParsed = QuestionSchema.safeParse(parsed);
				if (questionParsed.success) {
					selectedQuestions.set(chunk.Slug, questionParsed.data);
				}
			}
		}
	}

	return selectedQuestions;
};

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
		cache: "force-cache",
	});

	const data = await response.json();
	return ScoreSchema.parse(data);
};

const getPageChunks = async (pageSlug: string) => {
	const q = qs.stringify({
		filters: {
			Slug: {
				$eq: pageSlug,
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

		return parsed.data ? parsed.data.data[0].attributes.Content : [];
	} catch (e) {
		console.error("Failed to fetch page questions", e);
		return null;
	}
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
	console.log(endpoint);
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

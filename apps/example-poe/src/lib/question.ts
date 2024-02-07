import { env } from "@/env.mjs";
import { QAScoreSchema } from "@itell/core/qa";
import qs from "qs";
import { z } from "zod";

export const QuestionSchema = z.object({
	question: z.string(),
	answer: z.string(),
});
export type Question = z.infer<typeof QuestionSchema>;
export type SelectedQuestions = Map<string, Question>;

const PageQuestionsSchema = z
	.object({
		data: z.array(
			z.object({
				attributes: z.object({
					Content: z.array(
						z.object({
							Slug: z.string(),
							QuestionAnswerResponse: z.string().optional(),
						}),
					),
				}),
			}),
		),
	})
	.nonstrict();

export const getPageQuestions = async (pageSlug: string) => {
	const q = qs.stringify({
		filters: {
			slug: {
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
	const response = await (await fetch(endpoint)).json();

	const parsed = PageQuestionsSchema.safeParse(response);

	if (!parsed.success) {
		return null;
	}

	return parsed.data;
};

// async function to get QA scores from scoring API
export const getQAScore = async ({
	input,
	chunk_slug,
	page_slug,
}: { input: string; chunk_slug: string; page_slug: string }) => {
	const response = await fetch(`${env.NEXT_PUBLIC_SCORE_API_URL}/answer`, {
		method: "POST",
		body: JSON.stringify({
			page_slug: page_slug,
			chunk_slug: chunk_slug,
			answer: input,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();
	return QAScoreSchema.safeParse(data);
};

export const getRandomPageQuestions = async (pageSlug: string) => {
	const selectedQuestions: SelectedQuestions = new Map();
	const questions = await getPageQuestions(pageSlug);

	if (questions) {
		const chunks = questions.data[0].attributes.Content.filter((c) =>
			Boolean(c.QuestionAnswerResponse),
		);

		const chooseQuestion = (c: (typeof chunks)[number]) => {
			if (c.QuestionAnswerResponse) {
				const parsed = JSON.parse(c.QuestionAnswerResponse);
				const questionParsed = QuestionSchema.safeParse(parsed);
				if (questionParsed.success) {
					selectedQuestions.set(c.Slug, questionParsed.data);
				}
			}
		};
		if (chunks.length > 0) {
			chunks.forEach((chunk) => {
				if (Math.random() < 1 / 3) {
					chooseQuestion(chunk);
				}
			});

			// Each page will have at least one question
			if (selectedQuestions.size === 0) {
				const randChunk = Math.floor(Math.random() * (chunks.length - 1));
				chooseQuestion(chunks[randChunk]);
			}
		}
	}

	return selectedQuestions;
};

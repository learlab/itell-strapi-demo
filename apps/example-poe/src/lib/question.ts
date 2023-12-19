import { env } from "@/env.mjs";
import { QAScoreSchema } from "@itell/core/qa";
import { z } from "zod";
import qs from "qs";

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
	const response = await (
		await fetch(endpoint, {
			cache: "no-cache",
		})
	).json();

	const parsed = PageQuestionsSchema.safeParse(response);

	if (!parsed.success) {
		return null;
	}

	return parsed.data;
};

// async function to get QA scores from scoring API
export const getQAScore = async ({
	input,
	pageSlug,
	chunkSlug,
}: { input: string; pageSlug: string; chunkSlug: string }) => {
	const response = await fetch(`${env.NEXT_PUBLIC_SCORE_API_URL}/answer`, {
		method: "POST",
		body: JSON.stringify({
			page_slug: pageSlug,
			chunk_slug: chunkSlug,
			answer: input,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await response.json();
	return QAScoreSchema.safeParse(data);
};

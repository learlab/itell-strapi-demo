import { z } from "zod";
import qs from "qs";

export const QuizItemSchema = z.object({
	id: z.number(),
	Question: z.string(),
	Answers: z.array(
		z.object({
			id: z.number(),
			Text: z.string(),
			IsCorrect: z.boolean(),
		}),
	),
});

export const QuizSchema = z.array(QuizItemSchema);

export const PageQuizSchema = z
	.object({
		data: z.array(
			z.object({
				attributes: z.object({
					Quiz: z.object({
						data: z.object({
							attributes: z.object({
								Questions: QuizSchema,
							}),
						}),
					}),
				}),
			}),
		),
	})
	.nonstrict();

export const getQuiz = async (pageSlug: string) => {
	const q = qs.stringify({
		filters: {
			slug: {
				$eq: pageSlug,
			},
		},
		populate: ["Quiz.Questions", "Quiz.Questions.Answers"],
	});

	try {
		const endpoint = `https://itell-strapi-um5h.onrender.com/api/pages?${q}`;
		const response = await fetch(endpoint);
		const json = await response.json();

		const page = PageQuizSchema.safeParse(json);
		if (!page.success) {
			return null;
		}

		return page.data.data[0].attributes.Quiz.data.attributes.Questions;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export type QuizData = z.infer<typeof QuizSchema>;

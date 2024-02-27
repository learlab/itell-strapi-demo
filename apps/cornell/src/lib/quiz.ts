import qs from "qs";
import { z } from "zod";

export type AnswerData = Record<string, number[]>; // answerId: [choiceId]

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

export const getQuizCorrectCount = (quiz: QuizData, answerData: AnswerData) => {
	let correctCount = 0;
	for (const questionId in answerData) {
		const question = quiz.find((q) => q.id === Number(questionId));
		if (question) {
			const userAnswers = answerData[questionId];
			const correctAnswers = question.Answers.filter((a) => a.IsCorrect).map(
				(a) => a.id,
			);

			if (
				userAnswers.length === correctAnswers.length &&
				userAnswers.every((answer) => correctAnswers.includes(answer))
			) {
				correctCount++;
			}
		}
	}

	return correctCount;
};

export type QuizData = z.infer<typeof QuizSchema>;

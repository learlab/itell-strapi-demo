import { z } from "zod";

export const QuizItemSchema = z.object({
	id: z.number(),
	question: z.string(),
	answers: z.array(
		z.object({
			text: z.string(),
			correct: z.boolean(),
		}),
	),
});

export const QuizSchema = z.array(QuizItemSchema);

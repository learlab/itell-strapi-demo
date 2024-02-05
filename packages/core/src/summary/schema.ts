import { z } from "zod";

const PromptDetailsSchema = z.object({
	type: z.enum(["Topic Similarity", "Language Borrowing", "Language Borrowing (from iTELL AI)", "Content", "Wording", "English"]),
	feedback: z.object({
			// isPassed is null for content and wording when containment does not pass

		is_passed: z.boolean().nullable(),
		prompt: z.string().nullable()
	})

});

export const SummaryResponseSchema = z.object({
	containment: z.number(),
	containment_chat: z.number().nullable(),
	similarity: z.number(),
	content: z.number().nullable(),
	wording: z.number().nullable(),
	english: z.boolean(),
	included_keyphrases: z.array(z.string()),
	suggested_keyphrases: z.array(z.string()),
	is_passed: z.boolean(),
	prompt: z.string(),
	prompt_details: z.array(PromptDetailsSchema),
});


export const SummaryFeedbackSchema = z.object({
	prompt: z.string(),
	isPassed: z.boolean(),
	promptDetails: z.array(PromptDetailsSchema).nullable(),
	suggestedKeyphrases: z.array(z.string()).nullable(),
})

export type SummaryFeedback = z.infer<typeof SummaryFeedbackSchema>;
export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;


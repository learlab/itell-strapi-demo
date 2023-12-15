import { z } from "zod";

export const SummaryResponseSchema = z.object({
	content: z.number().nullable(),
	wording: z.number().nullable(),
	similarity: z.number(),
	containment: z.number(),
	included_keyphrases: z.array(z.string()),
	suggested_keyphrases: z.array(z.string()),
});

export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;

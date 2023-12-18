import { z } from "zod";

export const SummaryScoreSchema = z.object({
	content: z.number().nullable(),
	wording: z.number().nullable(),
	similarity: z.number(),
	containment: z.number(),
});
export type SummaryScore = z.infer<typeof SummaryScoreSchema>;

export const SummaryResponseSchema = z
	.object({
		included_keyphrases: z.array(z.string()),
		suggested_keyphrases: z.array(z.string()),
	})
	.merge(SummaryScoreSchema);
export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;


export const SectionLocationSchema = z.object({
	module: z.number(),
	chapter: z.number(),
	section: z.number(),
});

export const QAScoreSchema = z.object({
	score: z.number(),
	is_passing: z.boolean(),
});
export type QAScore = z.infer<typeof QAScoreSchema>;
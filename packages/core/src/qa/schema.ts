import { z } from "zod";

export const QAScoreSchema = z.object({
	score: z.number(),
	is_passing: z.boolean(),
});
export type QAScore = z.infer<typeof QAScoreSchema>;

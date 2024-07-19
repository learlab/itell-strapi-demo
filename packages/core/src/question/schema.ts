import { z } from "zod";

export const ScoreSchema = z.object({
	score: z.number(),
	is_passing: z.boolean(),
});
export type Score = z.infer<typeof ScoreSchema>;

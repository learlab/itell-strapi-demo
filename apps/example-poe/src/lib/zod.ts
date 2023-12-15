import { z } from "zod";

export const ClassSettingsSchema = z.object({
	no_feedback_pages: z.array(z.number()).optional(),
});

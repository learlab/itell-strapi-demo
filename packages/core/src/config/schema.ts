import { z } from "zod";

export const SiteConfigSchema = z
	.object({
		title: z.string(),
		description: z.string(),
		footer: z.string(),
		latex: z.boolean().optional(),
		favicon: z.string().optional(),
	})
	.strict();

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

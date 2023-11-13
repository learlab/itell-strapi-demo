import { z } from "zod";

export const ThemeColorSchema = z.object({
	background: z.string(),
	foreground: z.string(),
	muted: z.string(),
	mutedForeground: z.string(),
	popover: z.string(),
	popoverForeground: z.string(),
	card: z.string(),
	cardForeground: z.string(),
	border: z.string(),
	input: z.string(),
	primary: z.string(),
	primaryForeground: z.string(),
	secondary: z.string(),
	secondaryForeground: z.string(),
	accent: z.string(),
	accentForeground: z.string(),
	destructive: z.string(),
	destructiveForeground: z.string(),
	ring: z.string(),
	radius: z.string(),
	info: z.string(),
	warning: z.string(),
});

export const UserColorSchema = ThemeColorSchema.strict().partial().optional();

export type ThemeColor = z.infer<typeof ThemeColorSchema>;
// entire object could be undefined, or any of the properties could be undefined
export type UserColor = z.infer<typeof UserColorSchema>;

export const ThemeSchema = z.object({
	light: ThemeColorSchema,
	dark: ThemeColorSchema,
});
export const UserThemeSchema = z
	.object({
		light: UserColorSchema,
		dark: UserColorSchema,
	})
	.strict()
	.optional();

export type Theme = z.infer<typeof ThemeSchema>;
export type UserTheme = z.infer<typeof UserThemeSchema>;

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

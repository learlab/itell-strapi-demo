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
	"chart-1": z.string(),
	"chart-2": z.string(),
	"chart-3": z.string(),
	"chart-4": z.string(),
	"chart-5": z.string(),
	"note-popover": z.string(),
});

export const UserColorSchema = ThemeColorSchema.strict().partial().optional();

export type ThemeColor = z.infer<typeof ThemeColorSchema>;
// entire object could be undefined, or any of the properties could be undefined
export type UserColor = z.infer<typeof UserColorSchema>;

export const ThemeSchema = z.object({
	root: z.record(z.string()).optional(),
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

export const DefaultTheme: Theme = {
	light: {
		background: "0 0% 100%",
		foreground: "222.2 47.4% 11.2%",
		muted: "210 40% 96.1%",
		mutedForeground: "215.4 16.3% 46.9%",
		popover: "0 0% 100%",
		popoverForeground: "222.2 47.4% 11.2%",
		card: "0 0% 100%",
		cardForeground: "222.2 47.4% 11.2%",
		border: "214.3 31.8% 91.4%",
		input: "214.3 31.8% 91.4%",
		primary: "222.2 47.4% 11.2%",
		primaryForeground: "210 40% 98%",
		secondary: "210 40% 96.1%",
		secondaryForeground: "215.4 16.3% 46.9%",
		accent: "210 40% 96.1%",
		accentForeground: "215.4 16.3% 46.9%",
		destructive: "0 100% 50%",
		destructiveForeground: "215.4 16.3% 46.9%",
		ring: "210 40% 96.1%",
		radius: "0.5rem",
		info: "214 95% 93%",
		warning: "34 100% 92%",
		"chart-1": "12 76% 61%",
		"chart-2": "173 58% 39%",
		"chart-3": "197 37% 24%",
		"chart-4": "43 74% 66%",
		"chart-5": "27 87% 67%",
		"note-popover": "53.88 98% 80.4%",
	},
	dark: {
		background: "224 71% 4%",
		foreground: "213 31% 91%",
		muted: "223 47% 11%",
		mutedForeground: "215.4 16.3% 56.9%",
		popover: "224 71% 4%",
		popoverForeground: "215 20.2% 65.1%",
		card: "224 71% 4%",
		cardForeground: "213 31% 91%",
		border: "216 34% 17%",
		input: "216 34% 17%",
		primary: "210 40% 98%",
		primaryForeground: "222.2 47.4% 1.2%",
		secondary: "222.2 47.4% 11.2%",
		secondaryForeground: "210 40% 98%",
		accent: "216 34% 17%",
		accentForeground: "210 40% 98%",
		destructive: "0 63% 31%",
		destructiveForeground: "210 40% 98%",
		ring: "216 34% 17%",
		radius: "0.5rem",
		info: "214 95% 67%",
		warning: "34 100% 60%",
		"chart-1": "220 70% 50%",
		"chart-2": "160 60% 45%",
		"chart-3": "30 80% 55%",
		"chart-4": "280 65% 60%",
		"chart-5": "340 75% 55%",
		"note-popover": "193 79% 21%",
	},
};

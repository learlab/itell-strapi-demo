import { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { z } from "zod";

export const ColorSchema = z.object({
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

export type ThemeColor = z.infer<typeof ColorSchema>;
// entire object could be undefined, or any of the properties could be undefined

export const ThemeSchema = z.object({
	root: ColorSchema,
	dark: ColorSchema,
});
export const UserThemeSchema = z.object({
	root: ColorSchema.partial().optional(),
	dark: ColorSchema.partial().optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;
export type UserTheme = z.infer<typeof UserThemeSchema>;

export const DefaultTheme: Theme = {
	root: {
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
export const themeConfig: Partial<Config> = {
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		screens: {
			xs: "475px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
			"3xl": "1600px",
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				info: "hsl(var(--info))",
				warning: "hsl(var(--warning))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				"chart-1": "hsl(var(--chart-1))",
				"chart-2": "hsl(var(--chart-2))",
				"chart-3": "hsl(var(--chart-3))",
				"chart-4": "hsl(var(--chart-4))",
				"chart-5": "hsl(var(--chart-5))",
				"note-popover": "hsl(var(--note-popover))",
			},
			typography: {
				DEFAULT: {
					css: {
						h1: {
							"margin-top": "1.25em",
						},
						h2: {
							"margin-top": "1em",
						},
						h3: {
							"margin-top": "0.75em",
						},
						h4: {
							"margin-top": "0.5em",
						},
						p: {
							"margin-top": "1em",
							"margin-bottom": "1em",
						},
						ul: {
							"margin-top": "1em",
							"margin-bottom": "1em",
							"line-height": "1.5em",
						},
						li: {
							"margin-top": "0.3em",
							"margin-bottom": "0.3em",
						},
						figure: {
							"margin-top": "1em",
							"margin-bottom": "1em",
						},
						img: {
							"margin-top": "1em",
							"margin-bottom": "1em",
						},
					},
				},
				quoteless: {
					css: {
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
				serif: ["var(--font-serif)", ...fontFamily.serif],
				mono: ["var(--font-mono)", ...fontFamily.mono],
				handwritten: ["var(--font-handwritten)"],
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"border-color": {
					"0%, 100%": { "border-color": "transparent" },
					"50%": { "border-color": "hsl(var(--info))" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"border-color": "border-color 2s ease-in-out infinite",
			},
		},
	},
};

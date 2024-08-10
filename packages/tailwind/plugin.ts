import { Elements } from "@itell/constants";
import tailwind, { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import { DefaultTheme, ThemeColor, ThemeSchema } from "./theme";

const camelToKebab = (str: string) => {
	return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

const extractCssVariables = (obj: ThemeColor) => {
	const cssVariables: Record<string, string> = {};
	for (const [key, value] of Object.entries(obj)) {
		cssVariables[`--${camelToKebab(key)}`] = value;
	}

	return cssVariables;
};

export default plugin(
	({ addBase, config }) => {
		const themeParsed = ThemeSchema.safeParse(config("itell.theme"));
		let lightColors: Record<string, string> = {};
		let darkColors: Record<string, string> = {};
		if (themeParsed.success) {
			lightColors = extractCssVariables(themeParsed.data.light);
			darkColors = extractCssVariables(themeParsed.data.dark);
		} else {
			console.warn("site theme is not valid for tailwind, using default theme");
			lightColors = DefaultTheme.light;
			darkColors = DefaultTheme.dark;
		}

		// css variables
		addBase({
			":root": {
				"--nav-height": tailwind.spacing[16],
				"--expo-out":
					"linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)",

				"--foreground-light": lightColors["--foreground"],
				"--foreground-dark": darkColors["--foreground"],
				"--font-sans": "'Inter', sans-serif",
			},
			"*": {
				"border-color": "hsl(var(--border))",
				"min-width": "0px",
			},

			body: {
				"@apply bg-background text-foreground": {},
				fontFeatureSettings: '"rlig" 1, "calt" 1',
			},
			table: {
				userSelect: "none",
			},
			pre: {
				userSelect: "none",
			},
			code: {
				userSelect: "none",
			},
			thead: {
				"@apply px-4 text-left align-middle font-medium text-muted-foreground":
					{},
			},
			"tr:hover": { "@apply bg-muted/50": {} },
			tr: { "@apply border-b transition-colors": {} },
			td: { "@apply p-4 align-middle": {} },
			th: { "@apply max-w-[10rem]": {} },
			"h1, h2, h3, h4, h5": {
				scrollMarginTop: "calc(var(--nav-height) + 0.5rem)",
			},

			".light": lightColors,
			".dark": darkColors,
			".content-chunk": {
				position: "relative",
			},
			".skip-link": {
				position: "absolute",
				width: "1px",
				height: "1px",
				margin: "-1px",
				overflow: "hidden",
				clipPath: "rect(0px, 0px, 0px, 0px)",
			},
			".skip-link:focus": {
				position: "static",
				width: "auto",
				height: "auto",
				overflow: "auto",
				clipPath: "auto",
				padding: "12px",
				textDecoration: "underline",
				textUnderlineOffset: "0.4em",
				textDecorationColor: "hsl(var(--primary))",
			},
			".no-select": {
				"@apply select-none": {},
			},

			".blurred>*:not(.continue-reading-button-container, .scroll-back-button-container)":
				{
					filter: "blur(4px)",
					"user-select": "none",
					"pointer-events": "none",
				},
			".continue-reading-button-container": {
				position: "absolute",
				top: "min(4rem, 20%)",
				left: "50%",
				transform: "translate(-50%, -50%)",
				"z-index": "1",
			},
			".unlock-summary-button-container": {
				"@apply flex justify-center items-center p-4": {},
			},

			".scroll-back-button-container": {
				display: "flex",
				width: "100%",
				"justify-content": "center",
				"align-items": "center",
				gap: "8px",
				position: "absolute",
				bottom: "min(4rem, 20%)",
				transform: "translateX(-50%, -50%)",
				"z-index": "1",
			},
			[`#${Elements.TEXTBOOK_MAIN_WRAPPER}`]: {
				"@apply grid md:grid-cols-[minmax(200px,1fr)_minmax(auto,65ch)] lg:grid-cols-[1fr_3.5fr_minmax(auto,200px)] gap-2 lg:gap-4 flex-1":
					{},
			},
			[`#${Elements.TEXTBOOK_NAV}`]: {
				"@apply top-16 h-[calc(100vh-3.5rem)] hidden sticky md:block z-30 border-r-2":
					{},
			},
			[`#${Elements.TEXTBOOK_MAIN}`]: {
				"@apply relative p-4 lg:p-8 lg:pb-12": {},
			},
			[`#${Elements.PAGE_NAV}`]: {
				"@apply hidden lg:block": {},
			},
		});
	},
	{
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
	},
);

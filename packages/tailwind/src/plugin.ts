import { Elements } from "@itell/constants";
import tailwind from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import { DefaultTheme, UserThemeSchema, themeConfig } from "./theme.js";
import { extractCssVariables } from "./utils.js";

let rootColors = extractCssVariables(DefaultTheme.root);
let darkColors = extractCssVariables(DefaultTheme.dark);

export const AppPlugin = plugin(({ addBase, config }) => {
	const userTheme = UserThemeSchema.safeParse(config("itell.theme"));
	if (userTheme.success) {
		if (userTheme.data.root) {
			rootColors = {
				...rootColors,
				...extractCssVariables(userTheme.data.root),
			};
		}
		if (userTheme.data.dark) {
			darkColors = {
				...darkColors,
				...extractCssVariables(userTheme.data.dark),
			};
		}
	} else {
		console.warn("site theme is not valid for tailwind, using default theme");
	}

	// css variables
	addBase({
		// @ts-ignore
		":root": {
			"--nav-height": tailwind.spacing[16],
			"--expo-out":
				"linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)",

			"--foreground-light": rootColors["--foreground"],
			"--foreground-dark": darkColors["--foreground"],
			"--font-sans": "'Inter', sans-serif",
			...rootColors,
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
			"@apply grid md:grid-cols-[minmax(200px,1fr)_minmax(auto,65ch)] lg:grid-cols-[minmax(200px,1fr)_3fr_minmax(auto,200px)] gap-2 lg:gap-4 flex-1":
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
}, themeConfig);

export const UIPlugin = plugin(() => {}, themeConfig);

export const CodePlugin = plugin(({ addBase }) => {
	addBase({
		".prose code.language-math::before, .prose code.language-math::after": {
			content: "none",
		},
		".prose pre:has(code.language-math)": {
			"@apply bg-background text-foreground": {},
		},
		pre: {
			"@apply !px-0 rounded-lg": {},
		},
		code: {
			"@apply text-sm md:text-base leading-loose": {},
		},
		"pre > code": {
			counterReset: "line",
		},
		'code[data-theme*=" "], code[data-theme*=" "] span': {
			color: "var(--shiki-light)",
			backgroundColor: "var(--shiki-light-bg)",
		},
		'pre[data-theme*=" "]': {
			backgroundColor: "var(--shiki-light-bg)",
		},
		".dark": {
			'code[data-theme*=" "], code[data-theme*=" "] span': {
				color: "var(--shiki-dark)",
				backgroundColor: "var(--shiki-dark-bg)",
			},
			'pre[data-theme*=" "]': {
				backgroundColor: "var(--shiki-dark-bg)",
			},
		},
		"code[data-line-numbers]": {
			counterReset: "line",
		},
		"code[data-line-numbers] > [data-line]::before": {
			counterIncrement: "line",
			content: "counter(line)",
			"@apply inline-block w-4 mr-4 text-right text-gray-500": {},
		},
		"pre [data-line]": {
			"@apply px-4 border-l-2 border-l-transparent": {},
		},
		"[data-highlighted-line]": {
			background: "rgba(200, 200, 255, 0.1) !important",
			"@apply border-l-blue-400 !important": {},
		},
		"[data-highlighted-chars]": {
			"@apply bg-zinc-600/50 rounded": {},
			boxShadow: "0 0 0 4px rgb(82 82 91 / 0.5)",
		},
		"[data-chars-id]": {
			"@apply shadow-none p-1 border-b-2": {},
		},
		"[data-chars-id] span": {
			"@apply !text-inherit": {},
		},
		'[data-chars-id="v"]': {
			"@apply !text-pink-300 bg-rose-800/50 border-b-pink-600 font-bold": {},
		},
		'[data-chars-id="s"]': {
			"@apply !text-yellow-300 bg-yellow-800/50 border-b-yellow-600 font-bold":
				{},
		},
		'[data-chars-id="i"]': {
			"@apply !text-purple-200 bg-purple-800/50 border-b-purple-600 font-bold":
				{},
		},
		"[data-rehype-pretty-code-title]": {
			"@apply bg-[#746b4d] text-[#f4f4f4] dark:bg-zinc-700 dark:text-zinc-200 rounded-t-lg py-2 px-3 font-semibold text-sm":
				{},
		},
		"figure[data-rehype-pretty-code-figure]:has(> [data-rehype-pretty-code-title]) pre":
			{
				"@apply rounded-t-none bg-[var(--shiki-light-bg)] dark:bg-[var(--shiki-dark-bg)]":
					{},
			},
		"figure[data-rehype-pretty-code-figure] figcaption": {
			textAlign: "center",
		},
		figure: {
			"@apply mb-6 mt-1": {},
		},
		"pre, code, figure": {
			"@apply overflow-x-auto overflow-y-hidden": {},
		},
	});
});

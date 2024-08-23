import typographyPlugin from "@tailwindcss/typography";
import { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import { AppPlugin, CodePlugin, UIPlugin } from "./plugin.js";
import { DefaultTheme } from "./theme.js";

export { DefaultTheme, AppPlugin, UIPlugin, CodePlugin };

// for using as a preset in the tailwind config for an app
export const AppPreset = {
	darkMode: "class",
	content: [],
	plugins: [animatePlugin, typographyPlugin, AppPlugin],
} satisfies Config;

export const UIPreset = {
	darkMode: "class",
	content: [],
	plugins: [animatePlugin, typographyPlugin, UIPlugin],
} satisfies Config;

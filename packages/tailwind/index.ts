import typographyPlugin from "@tailwindcss/typography";
import { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import plugin from "./plugin";
import { DefaultTheme } from "./theme";

export { DefaultTheme };

// for using as a preset in the tailwind config for an app
export default {
	darkMode: "class",
	content: [],
	plugins: [animatePlugin, typographyPlugin, plugin],
} satisfies Config;

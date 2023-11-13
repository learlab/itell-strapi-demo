import { Config } from "tailwindcss";
// @ts-ignore
import animatePlugin from "tailwindcss-animate";
import typographyPlugin from "@tailwindcss/typography";
import plugin from "./plugin";

export default {
	darkMode: "class",
	content: [],
	plugins: [plugin, animatePlugin, typographyPlugin],
} satisfies Config;

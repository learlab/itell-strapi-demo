import { AppPreset, CodePlugin } from "@itell/tailwind";
import type { Config } from "tailwindcss";
export default {
	presets: [AppPreset],
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./content/**/*.mdx",
		"../../packages/ui/src/**/*.tsx",
		"../../packages/js-sandbox/src/**/*.tsx",
	],
	plugins: [CodePlugin],
} satisfies Config;

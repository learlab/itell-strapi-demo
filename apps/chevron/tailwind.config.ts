import { AppPreset } from "@itell/tailwind";
import type { Config } from "tailwindcss";

export default {
	presets: [AppPreset],
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./content/**/*.mdx",
		"../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
	],
} satisfies Config;

import type { Config } from "tailwindcss";
import tailwindPreset from "@itell/tailwind";
import { DefaultTheme } from "@itell/core/config";
import path from "path";

export default {
	presets: [tailwindPreset],
	content: ["./src/**/*.{js,ts,jsx,tsx}", "./content/**/*.mdx"],
	itell: {
		theme: DefaultTheme,
	},
} satisfies Config;

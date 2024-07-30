import tailwindPreset from "@itell/tailwind";
import { DefaultTheme } from "@itell/tailwind";
import type { Config } from "tailwindcss";

export default {
	presets: [tailwindPreset],
	content: ["./src/**/*.{js,ts,jsx,tsx}", "./content/**/*.mdx"],
	itell: {
		theme: DefaultTheme,
	},
} satisfies Config;

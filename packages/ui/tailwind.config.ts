import type { Config } from "tailwindcss";
import tailwindPreset from "@itell/tailwind";

export default {
	presets: [tailwindPreset],
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
} satisfies Config;

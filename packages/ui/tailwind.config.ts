import { UIPreset } from "@itell/tailwind";
import type { Config } from "tailwindcss";

export default {
	presets: [UIPreset],
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
} satisfies Config;

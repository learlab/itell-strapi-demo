import { AppPreset } from "@itell/tailwind";

import type { Config } from "tailwindcss";

export default {
  presets: [AppPreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/*.tsx",
    "./content/**/*.md",
  ],
  plugins: [],
  itell: {
    theme: {
      root: {
        info: "214 95% 67%",
        warning: "34 100% 60%",
      },
      dark: {
        info: "230 100% 69%",
        warning: "34 100% 50%",
      },
    },
  },
} satisfies Config;

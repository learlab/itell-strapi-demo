import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, UserConfigExport } from "vite";

import { getComponentEntries } from "./component-entries";

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [react()],
    build: {
      lib: {
        entry: {
          ...getComponentEntries(),
        },
        name: "ui",
        formats: ["es"],
        fileName: (format, name) => `${name}.js`,
      },
      rollupOptions: {
        external: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "tailwindcss",
          "next",
          "next/image",
          "next/navigation",
          "next/link",
          "lucide-react",
          "framer-motion",
          "recharts",
        ],
        plugins: [visualizer() as any, preserveDirectives() as any],
      },
    },
  });
};

// https://vitejs.dev/config/
export default app;

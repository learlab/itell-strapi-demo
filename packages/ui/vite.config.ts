import path from "node:path";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import preserveDirectives from "rollup-preserve-directives";

import { UserConfigExport, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { getComponentEntries } from "./component-entries";

const comp = (name: string) => path.resolve(__dirname, `src/${name}.tsx`);

const app = async (): Promise<UserConfigExport> => {
	return defineConfig({
		plugins: [
			react(),
			dts({
				insertTypesEntry: true,
			}),
		],
		build: {
			lib: {
				entry: {
					index: path.resolve(__dirname, "src/index.ts"),
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
				plugins: [visualizer(), preserveDirectives()],
			},
		},
	});
};

// https://vitejs.dev/config/
export default app;

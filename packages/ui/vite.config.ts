import path from "node:path";
import react from "@vitejs/plugin-react";
import banner from "rollup-plugin-banner2";
import { visualizer } from "rollup-plugin-visualizer";

import { UserConfigExport, defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
					server: path.resolve(__dirname, "src/components-server.ts"),
					client: path.resolve(__dirname, "src/components-client.ts"),
				},
				name: "ui",
				formats: ["es", "cjs"],
				fileName: (format, name) => `${name}.${format}.js`,
			},
			rollupOptions: {
				external: [
					"react",
					"react-dom",
					"react/jsx-runtime",
					"tailwindcss",
					"next",
					"next/navigation",
					"next/link",
					"lucide-react",
					"framer-motion",
					"recharts",
				],
				plugins: [
					visualizer(),
					banner((chunk) => {
						if (
							chunk.fileName === "client.cjs.js" ||
							chunk.fileName === "client.es.js"
						) {
							return '"use client";\n';
						}

						return "";
					}),
				],
			},
		},
	});
};

// https://vitejs.dev/config/
export default app;

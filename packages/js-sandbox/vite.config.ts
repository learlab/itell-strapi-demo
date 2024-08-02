import react from "@vitejs/plugin-react";
import banner from "rollup-plugin-banner2";
import tailwindcss from "tailwindcss";
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
		css: {
			postcss: {
				plugins: [tailwindcss],
			},
		},

		build: {
			commonjsOptions: { include: [] },
			lib: {
				entry: {
					index: "./src/index.ts",
					sandbox: "./src/sandbox.tsx",
					runner: "./src/runner.tsx",
					provider: "./src/provider.tsx",
				},
			},
			rollupOptions: {
				external: [
					"react",
					"react-dom",
					"tailwindcss",
					"next",
					"next-themes",
					"react/jsx-runtime",
					"next/dynamic",
					"itell/ui/server",
					"@itell/ui/client",
				],
				preserveSymlinks: true,
				plugins: [
					banner((chunk) => {
						if (
							chunk.fileName === "provider.js" ||
							chunk.fileName === "provider.cjs"
						) {
							return '"use client";\n';
						}

						return "";
					}),
				],
				output: {
					globals: {
						react: "React",
						"react-dom": "ReactDOM",
						tailwindcss: "tailwindcss",
						next: "next",
					},
				},
			},
		},
	});
};

// https://vitejs.dev/config/
export default app;

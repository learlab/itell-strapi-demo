import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import rollupPreserveDirectives from "rollup-preserve-directives";
import { UserConfigExport, defineConfig } from "vite";
import dts from "vite-plugin-dts";

const app = async (): Promise<UserConfigExport> => {
	return defineConfig({
		resolve: {
			alias: {
				"@/": `${path.resolve(__dirname, "src")}/`,
			},
		},
		build: {
			lib: {
				entry: {
					"event-tracker": path.resolve(__dirname, "src/event-tracker.tsx"),
					"portal-container": path.resolve(
						__dirname,
						"src/portal-container.tsx",
					),
					hooks: path.resolve(__dirname, "src/hooks/index.ts"),
					note: path.resolve(__dirname, "src/note/index.ts"),
					dashboard: path.resolve(__dirname, "src/dashboard/index.ts"),
					summary: path.resolve(__dirname, "src/summary/index.ts"),
					question: path.resolve(__dirname, "src/question/index.ts"),
					chat: path.resolve(__dirname, "src/chat/index.ts"),
				},
				name: "core",
				formats: ["es"],
				fileName: (format, name) => `${name}.js`,
			},
			emptyOutDir: true,
			rollupOptions: {
				external: [
					"react",
					"react/jsx-runtime",
					"react-dom",
					"zod",
					"node:fs/promises",
					"node:fs",
				],
				plugins: [visualizer(), rollupPreserveDirectives()],
			},
		},
	});
};
// https://vitejs.dev/config/
export default app;

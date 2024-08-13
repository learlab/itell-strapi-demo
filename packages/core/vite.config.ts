import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { UserConfigExport, defineConfig } from "vite";
import dts from "vite-plugin-dts";

const app = async (): Promise<UserConfigExport> => {
	return defineConfig({
		plugins: [dts()],
		resolve: {
			alias: {
				"@/": `${path.resolve(__dirname, "src")}/`,
			},
		},
		build: {
			lib: {
				entry: {
					index: path.resolve(__dirname, "src/index.ts"),
					hooks: path.resolve(__dirname, "src/hooks/index.ts"),
					config: path.resolve(__dirname, "src/config/index.ts"),
					note: path.resolve(__dirname, "src/note/index.ts"),
					dashboard: path.resolve(__dirname, "src/dashboard/index.ts"),
					summary: path.resolve(__dirname, "src/summary/index.ts"),
					question: path.resolve(__dirname, "src/question/index.ts"),
					chat: path.resolve(__dirname, "src/chat/index.ts"),
				},
				name: "core",
				formats: ["es", "cjs"],
				fileName: (format, name) => `${name}.${format}.js`,
			},
			emptyOutDir: true,
			rollupOptions: {
				external: ["react", "react-dom", "zod", "node:fs/promises", "node:fs"],
				plugins: [visualizer({ open: true })],
			},
		},
	});
};
// https://vitejs.dev/config/
export default app;

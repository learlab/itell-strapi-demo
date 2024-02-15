import path from "node:path";
import { UserConfigExport, defineConfig } from "vite";
import dts from "vite-plugin-dts";

const app = async (): Promise<UserConfigExport> => {
	return defineConfig({
		plugins: [
			dts({
				insertTypesEntry: true,
			}),
		],
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
					utils: path.resolve(__dirname, "src/utils.ts"),
					config: path.resolve(__dirname, "src/config/index.ts"),
					contentlayer: path.resolve(__dirname, "src/contentlayer.ts"),
					note: path.resolve(__dirname, "src/note/index.ts"),
					dashboard: path.resolve(__dirname, "src/dashboard/index.ts"),
					types: path.resolve(__dirname, "src/types/index.ts"),
					components: path.resolve(__dirname, "src/components/index.ts"),
					summary: path.resolve(__dirname, "src/summary/index.ts"),
					qa: path.resolve(__dirname, "src/qa/index.ts"),
					chatbot: path.resolve(__dirname, "src/chatbot/index.ts"),
				},
				name: "core",
				formats: ["es", "cjs"],
				fileName: (format, name) => `${name}.${format}.js`,
			},
			emptyOutDir: true,
			rollupOptions: {
				external: ["react", "fs/promises", "fs"],
				output: {
					globals: {
						react: "React",
					},
				},
			},
		},
	});
};
// https://vitejs.dev/config/
export default app;

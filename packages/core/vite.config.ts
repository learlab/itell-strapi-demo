import path from "node:path";
import dts from "vite-plugin-dts";
import { UserConfigExport, defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const app = async (): Promise<UserConfigExport> => {
	return defineConfig({
		plugins: [
			dts({
				insertTypesEntry: true,
			}),
		],
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

import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "src/index.ts",
			formats: ["es"],
			fileName: (_, name) => `${name}.js`,
		},
		rollupOptions: {
			external: ["zod"],
			plugins: [visualizer({ open: false })],
		},
	},
});

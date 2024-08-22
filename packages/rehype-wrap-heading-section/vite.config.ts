import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: "src/index.ts",
			name: "index",
			formats: ["es"],
			fileName: "index",
		},
	},
	plugins: [dts()],
});

import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "src/index.ts",
			name: "index",
			formats: ["es"],
			fileName: "index",
		},
	},
});

import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
	test: {
		// include: ["./tests/*.test.ts", "./tests/*.test.tsx"],
		setupFiles: path.resolve(__dirname, "tests/setup.ts"),
		globals: true,
		environmentMatchGlobs: [
			["**/*.test.tsx", "happy-dom"],
			["**/*.component.test.ts", "happy-dom"],
		],
	},

	resolve: {
		alias: {
			"@": "./src",
		},
	},
});

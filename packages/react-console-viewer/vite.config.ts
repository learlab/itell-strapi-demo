import { resolve } from "node:path";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "./src/index.ts"),
			name: "console",
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: ["react", "react-dom", "tailwindcss"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					tailwindcss: "tailwindcss",
				},
			},
		},
		sourcemap: true,
		emptyOutDir: true,
	},
	plugins: [react(), dts({ rollupTypes: true })],
	css: {
		postcss: {
			plugins: [tailwindcss],
		},
	},
});

import react from "@vitejs/plugin-react";
import path from "node:path";
import dts from "vite-plugin-dts";
import tailwindcss from "tailwindcss";
import { UserConfigExport, defineConfig } from "vite";

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
			lib: {
				entry: {
					index: path.resolve(__dirname, "src/index.ts"),
					server: path.resolve(__dirname, "src/components-server.ts"),
					client: path.resolve(__dirname, "src/components-client.ts"),
				},
				name: "ui",
				formats: ["es", "cjs"],
				fileName: (format, name) => `${name}.${format}.js`,
			},
			rollupOptions: {
				external: ["react", "react-dom", "tailwindcss", "next"],
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

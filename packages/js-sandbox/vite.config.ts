import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { UserConfigExport, defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
			commonjsOptions: { include: [] },
			lib: {
				entry: {
					sandbox: "./src/sandbox.tsx",
					runner: "./src/runner.tsx",
					provider: "./src/provider.tsx",
				},
			},
			rollupOptions: {
				external: ["react", "react-dom", "react/jsx-runtime"],
				preserveSymlinks: true,
				plugins: [],
			},
		},
	});
};

// https://vitejs.dev/config/
export default app;

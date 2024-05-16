import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "ITELL Docs",
			customCss: ["./src/tailwind.css", "./src/custom.css"],
			social: {
				github: "https://github.com/itell-strapi-demo",
			},
			sidebar: [
				{
					label: "Authoring",
					items: [
						{
							label: "Quick Start",
							link: "/authoring/quick-start",
						},
					],
				},
				{
					label: "Frontend Development",
					autogenerate: {
						directory: "development/frontend",
					},
				},
				{
					label: "Backend Development",
					autogenerate: {
						directory: "development/backend",
					},
				},
			],
		}),
		tailwind({
			applyBaseStyles: false,
		}),
		react(),
	],
});

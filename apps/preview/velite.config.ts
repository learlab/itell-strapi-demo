import rehypePrettyCode from "rehype-pretty-code";
import { defineConfig, s } from "velite";
import { rehypeAddTryExample } from "./plugin";

export default defineConfig({
	root: "content",
	collections: {
		reference: {
			name: "reference",
			single: true,
			pattern: "reference.md",
			schema: s
				.object({
					content: s.markdown({
						rehypePlugins: [rehypeAddTryExample],
					}),
				})
				.transform((data, { meta }) => {
					return {
						...data,
						headings: meta.mdast?.children
							.filter((note) => note.type === "heading")
							.map((note) =>
								"value" in note.children[0]
									? note.children[0].value
									: undefined,
							)
							.filter(Boolean),
					};
				}),
		},
		examples: {
			name: "example",
			pattern: "examples/*.md",
			schema: s.object({
				title: s.string(),
				slug: s.slug(),
				content: s.raw(),
				order: s.number(),
			}),
		},
	},
	markdown: {
		remarkPlugins: [],
		rehypePlugins: [
			() =>
				rehypePrettyCode({
					theme: {
						dark: "one-dark-pro",
						light: "github-light",
					},
				}),
		],
	},
});

import { components } from "@/lib/shared-components";
import htmr from "htmr";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import remarkHeadingId from "remark-heading-id";
import remarkMath from "remark-math";
import { defineConfig, s } from "velite";

export default defineConfig({
	root: "content",
	collections: {
		reference: {
			name: "reference",
			single: true,
			pattern: "reference.md",
			schema: s.object({
				content: s.markdown(),
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
		remarkPlugins: [remarkHeadingId, remarkMath],
		rehypePlugins: [
			// @ts-ignore
			rehypeKatex,
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

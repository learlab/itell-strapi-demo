import { extractHeadingsFromMdast } from "@itell/content";
import rehypePrettyCode from "rehype-pretty-code";
import remarkHeadingId from "remark-heading-id";
import { defineConfig, s } from "velite";

export default defineConfig({
	root: "content",
	collections: {
		reference: {
			name: "reference",
			single: true,
			pattern: "*.md",
			schema: s.object({
				content: s.markdown(),
			}),
		},
	},
	markdown: {
		remarkPlugins: [remarkHeadingId],
		rehypePlugins: [
			() =>
				rehypePrettyCode({
					theme: {
						dark: "one-dark-pro",
						light: "github-light",
					},
					defaultLang: "js",
				}),
		],
	},
});

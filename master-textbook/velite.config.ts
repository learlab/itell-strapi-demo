import { exec } from "node:child_process";
import { promisify } from "node:util";
import GithubSlugger from "github-slugger";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import remarkMath from "remark-math";

import {
	extractChunksFromHast,
	extractHeadingsFromMdast,
} from "@itell/content";
import { defineCollection, defineConfig, defineSchema, s } from "velite";
import { env } from "node:process";

const execAsync = promisify(exec);

const TEXTBOOK_NAME = env.TEXTBOOK_NAME;
console.log(TEXTBOOK_NAME);

const timestamp = defineSchema(() =>
	s
		.custom<string | undefined>((i) => i === undefined || typeof i === "string")
		.transform<string>(async (value, { meta, addIssue }) => {
			if (value != null) {
				addIssue({
					fatal: false,
					code: "custom",
					message:
						"`s.timestamp()` schema will resolve the value from `git log -1 --format=%cd`",
				});
			}
			const { stdout } = await execAsync(
				`git log -1 --format=%cd ${meta.path}`,
			);
			return new Date(stdout).toDateString();
		}),
);

const pages = defineCollection({
	name: "Page",
	pattern: `${TEXTBOOK_NAME}/textbook/**/*.mdx`,
	schema: s
		.object({
			title: s.string(),
			description: s.string().optional(),
			page_slug: s.slug(),
			code: s.mdx(),
			summary: s.boolean(),
			reference_summary: s.string().optional(),
			excerpt: s.excerpt(),
			last_modified: timestamp(),
		})
		.transform((data, { meta }) => {
			return {
				...data,
				href: `/${data.page_slug}`,
				chapter: Number(meta.basename?.split("-")[1].replaceAll(".mdx", "")),
				headings: extractHeadingsFromMdast(meta.mdast),
				chunks: extractChunksFromHast(meta.hast),
			};
		}),
});

const guides = defineCollection({
	name: "Guide",
	pattern: "guide/**/*.md",
	schema: s.object({
		condition: s.string(),
		code: s.mdx(),
	}),
});

const home = defineCollection({
	name: "Home",
	pattern: `${TEXTBOOK_NAME}/home.md`,
	single: true,
	schema: s.object({
		code: s.mdx(),
	}),
});

export default defineConfig({
	root: "./content",
	collections: { pages, guides, home },
	mdx: {
		gfm: false,
		// @ts-ignore
		remarkPlugins: [remarkGfm, remarkMath, remarkHeadingId],
		rehypePlugins: [
			// @ts-ignore
			rehypeSlug,
			// @ts-ignore
			rehypeKatex,
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

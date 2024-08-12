import { exec } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import {
	extractChunksFromHast,
	extractHeadingsFromMdast,
} from "@itell/content";
import remarkWikiLink from "@itell/remark-wiki-link";
import GithubSlugger from "github-slugger";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import { defineCollection, defineConfig, defineSchema, s } from "velite";

const execAsync = promisify(exec);
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
	pattern: "textbook/**/*.mdx",
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
	pattern: "guide/**/*.mdx",
	schema: s.object({
		condition: s.string(),
		code: s.mdx(),
	}),
});

const home = defineCollection({
	name: "Home",
	pattern: "home.mdx",
	single: true,
	schema: s.object({
		code: s.mdx(),
	}),
});

export default defineConfig({
	root: "./content",
	collections: { pages, guides, home },
	mdx: {
		remarkPlugins: [remarkGfm, remarkWikiLink, remarkHeadingId],
		// @ts-ignore
		rehypePlugins: [rehypeSlug],
	},
	prepare: async (data) => {
		const output: {
			nodes: { id: string; label: string; type: string }[];
			edges: { source: string; target: string; label: string }[];
		} = {
			nodes: [],
			edges: [],
		};
		data.pages.forEach((page) => {
			output.nodes.push({
				id: page.page_slug,
				label: page.title,
				type: "page",
			});
			page.chunks.forEach((chunk) => {
				output.nodes.push({
					id: chunk,
					label: chunk,
					type: "chunk",
				});
				output.edges.push({
					source: page.page_slug,
					target: chunk,
					label: "page-chunk",
				});
			});
		});

		await writeFile("public/data/graph.json", JSON.stringify(output, null, 2));
	},
});

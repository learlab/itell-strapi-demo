import { exec } from "node:child_process";
import { promisify } from "node:util";
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
				headings: getHeadingsFromRawBody(meta.content || ""),
				chunks: getPageChunks(meta.content || ""),
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
		// @ts-ignore

		remarkPlugins: [remarkGfm, remarkHeadingId],
		// @ts-ignore

		rehypePlugins: [rehypeSlug],
	},
});

const getHeadingsFromRawBody = (doc: string) => {
	// Updated regex to capture the heading content and potential ID separately
	const regXHeader = /\n(#{1,6})\s+(.+?)(?:\s+\\{#([\w-]+)\})?$/gm;

	const slugger = new GithubSlugger();

	const headings: Array<{ level: string; text: string; slug: string }> = [];
	for (const match of doc.matchAll(regXHeader)) {
		const flag = match[1];
		const content = match[2].trim(); // This now excludes the custom ID part
		const customId = match[3]; // Capture the custom ID if present
		if (content && content !== "null") {
			headings.push({
				level:
					flag.length === 1
						? "one"
						: flag.length === 2
							? "two"
							: flag.length === 3
								? "three"
								: flag.length === 4
									? "four"
									: "other",
				text: content, // This is now clean, without the custom ID
				slug: customId || slugger.slug(content), // Use custom ID if present, otherwise use slugger
			});
		}
	}

	return headings;
};

const getPageChunks = (raw: string) => {
	const contentChunkRegex =
		/<section(?=\s)(?=[\s\S]*?\bclassName="content-chunk")(?=[\s\S]*?\bdata-subsection-id="([^"]+)")[\s\S]*?>/g;
	const chunks = [];

	const matches = raw.matchAll(contentChunkRegex);

	for (const match of matches) {
		if (match[1]) {
			chunks.push(match[1]);
		}
	}

	return chunks;
};

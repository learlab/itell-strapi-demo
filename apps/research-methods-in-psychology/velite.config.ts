import { exec } from "node:child_process";
import { promisify } from "node:util";
import { extractHeadingsFromMdast } from "@itell/content";
import rehypeAddCri from "@itell/rehype-add-cri";
import rehypeWrapHeadingSection from "@itell/rehype-wrap-heading-section";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkHeadingAttrs from "remark-heading-attrs";
import remarkUnwrapImage from "remark-unwrap-images";
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
	pattern: "textbook/**/*.md",
	schema: s
		.object({
			title: s.string(),
			order: s.number(),
			slug: s.slug(),
			assignments: s.array(s.string()),
			description: s.string().optional(),
			chunks: s.array(
				s.object({ slug: s.string(), type: s.enum(["plain", "regular"]) }),
			),
			excerpt: s.excerpt(),
			last_modified: timestamp(),
			cri: s.array(
				s.object({
					slug: s.string(),
					question: s.string(),
					answer: s.string(),
				}),
			),
			html: s.markdown(),
		})
		.transform((data, { meta }) => {
			const headings = extractHeadingsFromMdast(meta.mdast);
			return {
				...data,
				summary: data.assignments.includes("summary"),
				href: `/${data.slug}`,
				headings,
			};
		}),
});

const guides = defineCollection({
	name: "Guide",
	pattern: "guide/**/*.md",
	schema: s.object({
		condition: s.string(),
		html: s.markdown(),
	}),
});

const home = defineCollection({
	name: "Home",
	pattern: "home.md",
	single: true,
	schema: s.object({
		html: s.markdown(),
	}),
});

export default defineConfig({
	root: "./content",
	collections: { pages, guides, home },
	markdown: {
		remarkPlugins: [remarkGfm, remarkHeadingAttrs, remarkUnwrapImage],
		rehypePlugins: [rehypeSlug as any, rehypeWrapHeadingSection, rehypeAddCri],
	},
});

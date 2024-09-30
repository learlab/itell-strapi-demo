import { exec } from "node:child_process";
import { promisify } from "node:util";
import rehypeAddCri from "@itell/rehype-add-cri";
import rehypeWrapHeadingSection from "@itell/rehype-wrap-heading-section";
import rehypeFormat from "rehype-format";
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
			next_slug: s.string().nullable(),
			parent: s
				.object({
					title: s.string(),
					slug: s.string(),
				})
				.nullable(),
			assignments: s.array(s.string()),
			description: s.string().optional(),
			chunks: s.array(
				s.object({
					title: s.string(),
					slug: s.string(),
					type: s.enum(["plain", "regular", "video"]),
					headings: s
						.array(
							s.object({
								title: s.string(),
								level: s.union([s.literal(3), s.literal(4)]),
								slug: s.string(),
							}),
						)
						.optional(),
				}),
			),
			quiz: s
				.array(
					s.object({
						question: s.string(),
						answers: s.array(
							s.object({
								answer: s.string(),
								correct: s.boolean(),
							}),
						),
					}),
				)
				.nullable(),
			excerpt: s.excerpt(),
			last_modified: timestamp(),
			cri: s.array(
				s.object({
					slug: s.string(),
					question: s.string(),
					answer: s.string(),
				}),
			),
			html: s.markdown({
				remarkPlugins: [remarkHeadingAttrs],
				rehypePlugins: [rehypeWrapHeadingSection, rehypeAddCri, rehypeFormat],
			}),
		})
		.transform((data) => {
			return {
				...data,
				summary: data.assignments.includes("summary"),
				href: `/${data.slug}`,
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
		remarkPlugins: [remarkGfm, remarkUnwrapImage],
		rehypePlugins: [],
	},
});

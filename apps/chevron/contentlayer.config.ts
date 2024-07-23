import { defineDocumentType, makeSource } from "contentlayer/source-files";
import GithubSlugger from "github-slugger";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";

const Home = defineDocumentType(() => ({
	name: "Home",
	filePathPattern: "home.mdx",
	contentType: "mdx",
	isSingleton: true,
}));

const Guide = defineDocumentType(() => ({
	name: "Guide",
	filePathPattern: "guide/**/*.{md,mdx}",
	contentType: "mdx",
	fields: {
		condition: {
			type: "string",
			description: "The matched user condition",
			required: true,
		},
	},
}));

const Page = defineDocumentType(() => ({
	name: "Page",
	filePathPattern: "textbook/**/*.{md,mdx}",
	contentType: "mdx",
	fields: {
		title: {
			type: "string",
			description: "The title of the page",
			required: true,
		},
		description: {
			type: "string",
			description: "The description of the page",
			required: false,
		},
		page_slug: {
			type: "string",
			description: "The slug of the page",
			required: true,
		},
		summary: {
			type: "boolean",
			default: true,
			description: "Whether the page requires a summary",
			required: false,
		},
		quiz: {
			type: "boolean",
			default: false,
			description: "Whether the page requires a quiz",
			required: false,
		},
		reference_summary: {
			type: "string",
			description: "The reference summary for the page",
			required: false,
		},
	},
	computedFields: {
		url: {
			type: "string",
			description: "The URL of the page",
			resolve: (doc) => `/${doc.page_slug}`,
		},
		chapter: {
			type: "number",
			description: "The chapter index of the page",
			resolve: (doc) => {
				return Number(
					doc._raw.sourceFileName.split("-")[1].replaceAll(".mdx", ""),
				);
			},
		},

		headings: {
			type: "json",
			description:
				"An array of {level, text, slug} objects representing the table of contents of the doc",
			resolve: (doc) => getHeadingsFromRawBody(doc.body.raw),
		},
	},
}));

export default makeSource({
	contentDirPath: "content",
	documentTypes: [Page, Home, Guide],
	mdx: {
		// @ts-ignore
		remarkPlugins: [remarkGfm, remarkHeadingId],
		rehypePlugins: [rehypeSlug],
	},
	disableImportAliasWarning: true,
});

const getHeadingsFromRawBody = (doc: string) => {
	// Updated regex to capture potential ID modifiers
	const regXHeader = /\n(#{1,6})\s+(.+?)(?:\s+\\{#[\w-]+\})?$/gm;

	const slugger = new GithubSlugger();

	const headings: Array<{ level: string; text: string; slug: string }> = [];
	for (const match of doc.matchAll(regXHeader)) {
		const flag = match[1];
		const content = match[2].trim(); // Trim any trailing whitespace
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
				text: content,
				slug: slugger.slug(content),
			});
		}
	}

	return headings;
};

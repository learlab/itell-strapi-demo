import { defineDocumentType, makeSource } from "contentlayer/source-files";
import GithubSlugger from "github-slugger";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const getHeadingsFromRawBody = (doc: string) => {
	const regXHeader = /\n(#{1,6})\s+(.+)/g;

	const slugger = new GithubSlugger();

	const headings: Array<{ level: string; text: string; slug: string }> = [];
	for (const match of doc.matchAll(regXHeader)) {
		const flag = match[1];
		const content = match[2];
		if (content && content !== "null") {
			headings.push({
				level:
					flag?.length === 1
						? "one"
						: flag?.length === 2
							? "two"
							: flag?.length === 3
								? "three"
								: flag?.length === 4
									? "four"
									: "other",
				text: content,
				slug: slugger.slug(content),
			});
		}
	}

	return headings;
};

const Home = defineDocumentType(() => ({
	name: "Home",
	filePathPattern: "home.mdx",
	contentType: "mdx",
	isSingleton: true,
}));

const SummaryDescription = defineDocumentType(() => ({
	name: "SummaryDescription",
	filePathPattern: "summary-description.mdx",
	contentType: "mdx",
	isSingleton: true,
}));

const UserGuide = defineDocumentType(() => ({
	name: "UserGuide",
	filePathPattern: "userguide.mdx",
	contentType: "mdx",
	isSingleton: true,
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
				return Number(doc._raw.sourceFileDir.split("-")[1]);
			},
		},
		section: {
			type: "number",
			description: "The section index of the page",
			resolve: (doc) => {
				const sectionName = doc._raw.sourceFileName;
				if (sectionName === "index.mdx") {
					return 0;
				}

				return Number(
					doc._raw.sourceFileName.split("-")[1].replace(".mdx", ""),
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
	documentTypes: [Page, Home, SummaryDescription, UserGuide],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
	},
	disableImportAliasWarning: true,
});

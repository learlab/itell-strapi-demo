import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
	getHeadingsFromRawBody,
	getLocationFromFlattenedPath,
	getSlugFromFlattenedPath,
} from "./src/lib/contentlayer";

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
	filePathPattern: "textbook/*.{md,mdx}",
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
	},
	computedFields: {
		url: {
			type: "string",
			description: "The URL of the page",
			resolve: (doc) => `/${doc.page_slug}`,
		},
		chapter: {
			type: "number",
			description:
				"The chapter index of the page, used for sorting and navigation",
			resolve: (doc) => Number(doc._raw.flattenedPath.split("-")[1]),
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

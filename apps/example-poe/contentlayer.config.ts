import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
	getHeadingsFromRawBody,
	getLocationFromFlattenedPath,
	getSlugFromFlattenedPath,
} from "./src/lib/contentlayer";

const Site = defineDocumentType(() => ({
	name: "Site",
	filePathPattern: "site/**/*.{md,mdx}",
	contentType: "mdx",
	computedFields: {
		slug: {
			type: "string",
			resolve: (doc) =>
				getSlugFromFlattenedPath(doc._raw.flattenedPath, "site/"),
		},
	},
}));

const Page = defineDocumentType(() => ({
	name: "Page",
	filePathPattern: "section/**/*.{md,mdx}",
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
			description: "Whether the page has a quiz",
			required: false,
		},
	},
	computedFields: {
		url: {
			type: "string",
			description: "The URL of the page",
			resolve: (doc) => `/${doc.page_slug}`,
		},
		location: {
			type: "json",
			description:
				"A {module, chapter, section} object representing the location of the doc",
			resolve: (doc) => getLocationFromFlattenedPath(doc._raw.flattenedPath),
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
	documentTypes: [Page, Site],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
	},
	disableImportAliasWarning: true,
});

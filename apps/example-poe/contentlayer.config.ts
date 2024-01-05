import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
	getHeadingsFromRawBody,
	getLocationFromFlattenedPath,
	getSlugFromFlattenedPath,
} from "./src/lib/contentlayer";

const slugify = (str: string) =>
	str.toLowerCase().replace(/\s/g, "-").replace(/[?.!]/g, "");

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
			resolve: (doc) => `/${doc.page_slug}`,
		},
		location: {
			type: "json",
			resolve: (doc) => getLocationFromFlattenedPath(doc._raw.flattenedPath),
		},
		headings: {
			type: "json",
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

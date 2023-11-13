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

const Section = defineDocumentType(() => ({
	name: "Section",
	filePathPattern: "section/**/*.{md,mdx}",
	contentType: "mdx",
	fields: {
		title: {
			type: "string",
			description: "The title of the Section",
			required: true,
		},
		qa: {
			type: "boolean",
			description: "If the page should include question & answers",
			required: false,
			default: false,
		},
		summary: {
			type: "boolean",
			default: true,
			description: "Whether the section requires a summary",
			required: false,
		},
	},
	computedFields: {
		url: {
			type: "string",
			resolve: (doc) =>
				getSlugFromFlattenedPath(doc._raw.flattenedPath, "section/"),
		},
		location: {
			type: "json",
			resolve: (doc) => getLocationFromFlattenedPath(doc._raw.flattenedPath),
		},
		slug: {
			type: "json",
			resolve: (doc) => doc.title.toLowerCase().replace(/\s/g, "-"),
		},
		headings: {
			type: "json",
			resolve: (doc) => getHeadingsFromRawBody(doc.body.raw),
		},
	},
}));

export default makeSource({
	contentDirPath: "content",
	documentTypes: [Section, Site],
	mdx: {
		remarkPlugins: [remarkGfm, remarkMath],
		rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex],
	},
	disableImportAliasWarning: true,
});

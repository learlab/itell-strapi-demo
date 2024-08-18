import { expose } from "comlink";
import type { Root as Hast } from "hast";
import type { Root as Mdast } from "mdast";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { PluggableList } from "unified";
import { SKIP, visit } from "unist-util-visit";

export type WorkerApi = typeof workerApi;

const workerApi = {
	transform: async (code: string) => {
		return _transform(code);
	},
};

expose(workerApi);

const remarkRemoveComments = () => (tree: Mdast) => {
	visit(tree, "html", (node, index, parent) => {
		if (node.value.match(/<!--([\s\S]*?)-->/g) && parent && index) {
			parent.children.splice(index, 1);
			return [SKIP, index]; // https://unifiedjs.com/learn/recipe/remove-node/
		}
	});
};

const rehypeMetaString = () => (tree: Hast) => {
	visit(tree, "element", (node) => {
		if (node.tagName === "code" && node.data?.meta) {
			node.properties ??= {};
			node.properties.metastring = node.data.meta;
		}
	});
};
const remarkPlugins: PluggableList = [
	remarkGfm,
	remarkHeadingId,
	remarkRemoveComments,
	remarkMath,
];

export const _transform = async (value: string) => {
	const rehypePlugins: PluggableList = [
		// @ts-ignore
		rehypeSlug,
		// @ts-ignore
		rehypeKatex,
		() =>
			rehypePrettyCode({
				theme: {
					dark: "one-dark-pro",
					light: "github-light",
				},
			}),
	];

	const html = await unified()
		.use(remarkParse) // parse markdown content to a syntax tree
		.use(remarkPlugins) // apply remark plugins
		.use(remarkRehype, {
			allowDangerousHtml: true,
		})
		.use(rehypeMetaString)
		.use(rehypeRaw) // turn markdown syntax tree to html syntax tree, with raw html support
		.use(rehypePlugins) // apply rehype plugins
		.use(rehypeStringify) // serialize html syntax tree
		.process({ value });

	return html.toString();
};

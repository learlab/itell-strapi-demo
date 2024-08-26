import type { Root } from "mdast";
import { visit } from "unist-util-visit";

interface Options {
	className?: string;
}

const wikiLinkRegex = /\[\[([^\]\|]+)(?:\|([^\]]+))?\]\]/g;

const remarkWikiLink = (options?: Options) => {
	const { className = "wiki-link" } = options || {};
	return (tree: Root) => {
		visit(tree, "text", (node, index, parent) => {
			const content = node.value;

			if (typeof content !== "string") {
				return;
			}

			const matches = Array.from(content.matchAll(wikiLinkRegex));

			if (matches.length === 0) return;
			const children = [];
			let lastIndex = 0;

			for (const match of matches) {
				const [fullMatch, text, linkType] = match;
				if (!text) return;
				const startIndex = match.index;
				const endIndex = startIndex + fullMatch.length;

				// Add text before the wiki link
				if (startIndex > lastIndex) {
					children.push({
						type: "text",
						value: content.slice(lastIndex, startIndex),
					});
				}

				// Create link node
				const linkNode = {
					type: "link",
					url: "",
					children: [{ type: "text", value: text.trim() }],
					data: {
						hProperties: {
							className,
							"data-link-id": text.trim(),
							...(linkType && { "data-link-type": linkType.trim() }),
						},
					},
				};

				children.push(linkNode);

				lastIndex = endIndex;
			}

			// Add remaining text after the last wiki link
			if (lastIndex < content.length) {
				children.push({
					type: "text",
					value: content.slice(lastIndex),
				});
			}

			if (parent && typeof index === "number") {
				// @ts-ignore
				parent.children.splice(index, 1, ...children);
			}
		});
	};
};

export default remarkWikiLink;

// @ts-nocheck
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

export const rehypeAddTryExample = () => {
	return (tree: Root) => {
		visit(tree, "element", (node: Element, index, parent) => {
			if (
				node.tagName === "pre" &&
				node.children &&
				node.children.length === 1
			) {
				const codeElement = node.children[0] as Element;

				const link = {
					type: "element",
					tagName: "i-try-example",
					properties: {
						text: codeElement.children[0].value,
					},
					children: [],
				};

				if (parent && typeof index === "number") {
					// Insert the new element after the 'pre' element
					parent.children.splice(index + 1, 0, link);
				}
			}
		});
	};
};

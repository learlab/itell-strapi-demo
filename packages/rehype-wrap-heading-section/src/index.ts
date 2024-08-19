import type { Element, Root } from "hast";
import { h } from "hastscript";
import { SKIP, visit } from "unist-util-visit";

export default function rehypeWrapHeadingSection() {
	return (tree: Root) => {
		const sections: Element[] = [];
		let currentSection: Element | null = null;
		let hasFoundH2 = false;

		// Function to finalize current section
		const finalizeSection = () => {
			if (currentSection) {
				currentSection.children.push({ type: "text", value: "\n" });
				sections.push(currentSection);
				currentSection = null;
			}
		};

		visit(tree, (node, index, parent) => {
			if (
				node.type === "element" &&
				node.tagName === "h2" &&
				index !== undefined &&
				parent === tree
			) {
				finalizeSection();
				hasFoundH2 = true;

				const id = (node as Element).properties?.id;

				currentSection = h(
					"section",
					{
						class: "content-chunk",
						"data-chunk-slug": id,
						"aria-labelledby": id,
					},
					[
						{ type: "text", value: "\n\n" },
						h("h2", (node as Element).properties, [
							...(node as Element).children,
						]),
						{ type: "text", value: "\n\n" },
					],
				);

				return [SKIP, index + 1];
			}

			if (currentSection && parent === tree && index !== null) {
				currentSection.children.push(node);
				return [SKIP, index + 1];
			}
		});

		finalizeSection();

		// Only replace tree children if we found at least one h2
		if (hasFoundH2) {
			// Add newlines between sections
			const newTree = { type: "root", children: [] };
			sections.forEach((section, index) => {
				newTree.children.push(section);
				if (index < sections.length - 1) {
					newTree.children.push({ type: "text", value: "\n\n" });
				}
			});

			tree.children = newTree.children;
		}
		// If no h2 found, we do nothing and the tree remains unchanged
	};
}

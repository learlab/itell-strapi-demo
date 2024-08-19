import { readFile } from "node:fs/promises";
import { Element, Root } from "hast";
import { h } from "hastscript";
import { SKIP, visit } from "unist-util-visit";
import yaml from "yaml";

export const rehypeWrapHeadingSection = () => {
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
};

export const rehypeFrontmatter = () => {
	return (tree: Root, file) => {
		const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
		const match = file.value.match(frontmatterRegex);

		if (match) {
			const [, frontmatterString] = match;
			const frontmatter = yaml.parse(frontmatterString);
			const cri = Object.fromEntries(
				frontmatter.cri.map((item) => [
					item.slug,
					{ question: item.question, answer: item.answer },
				]),
			);
			console.log("cri is", cri);
			file.cri = cri;
		}
		visit(tree, "element", () => {
			return SKIP;
		});
	};
};

export const rehypeAddCri = () => {
	return async (tree: Root, file) => {
		const content = await readFile(file.history[0], "utf-8");
		const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
		const match = content.toString().match(frontmatterRegex);
		let pageSlug = "";
		let cri: Record<string, { question: string; answer: string }> = {};
		if (match) {
			const [, frontmatterString] = match;
			const frontmatter = yaml.parse(frontmatterString);
			pageSlug = frontmatter.slug;
			cri = Object.fromEntries(
				frontmatter.cri.map((item) => [
					item.slug,
					{ question: item.question, answer: item.answer },
				]),
			);
		}
		visit(tree, "element", (node) => {
			if (
				node.tagName === "section" &&
				node.properties &&
				node.properties.dataChunkSlug
			) {
				const chunkSlug = node.properties.dataChunkSlug as string;
				if (cri[chunkSlug]) {
					const item = cri[chunkSlug];

					const newElement: Element = {
						type: "element",
						tagName: "i-question",
						properties: {
							question: item.question,
							answer: item.answer,
							"chunk-slug": chunkSlug,
							"page-slug": pageSlug,
						},
						children: [],
					};

					// Append the new element to the end of the section
					node.children.push({ type: "text", value: "\n\n" }, newElement, {
						type: "text",
						value: "\n\n",
					});
				}
			}
		});
	};
};

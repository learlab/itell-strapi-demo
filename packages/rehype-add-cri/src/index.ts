import { readFile } from "node:fs/promises";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import yaml from "yaml";

export default function rehypeAddCri() {
	return async (tree: Root, file: VFile) => {
		const path = file.history[0]?.toString();
		if (!path) {
			return;
		}

		const content = await readFile(path, "utf-8");
		const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
		const match = content.toString().match(frontmatterRegex);
		let pageSlug = "";
		let cri: Record<string, { question: string; answer: string }> = {};
		if (match) {
			const [, frontmatterString] = match;
			if (!frontmatterString) {
				return;
			}
			const frontmatter = yaml.parse(frontmatterString);
			if (!frontmatter.cri) {
				return;
			}
			pageSlug = frontmatter.slug;
			cri = Object.fromEntries(
				frontmatter.cri.map(
					(item: { slug: string; question: string; answer: string }) => [
						item.slug,
						{ question: item.question, answer: item.answer },
					],
				),
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
}

import Slugger from "github-slugger";
import type { Element, Nodes } from "hast";
import type { Root } from "mdast";

export declare namespace extractChunksFromHast {
	type Input = Nodes | undefined;
}

/**
 * Extract an array of chunk slugs from the velite meta.hast output
 *
 * @param input - meta.hast from velite output
 * @returns An array of chunk slugs
 */
export const extractChunksFromHast = (input: extractChunksFromHast.Input) => {
	if (!input || !("children" in input)) return [];
	return Array.from(input.children)
		.filter((child) => child.type === "element" && child.tagName === "section")
		.map((child) => (child as Element).properties?.dataSubsectionId as string);
};

export declare namespace extractHeadingsFromMdast {
	type Input = Root | undefined;
}

const srOnlyRegex = /\{#[^}]*\s+\.sr-only\}/;
const headingAttrRegex = /\{#[^}]+\}\s*$/;

export const extractHeadingsFromMdast = (
	input: extractHeadingsFromMdast.Input,
) => {
	if (!input) return [];

	const slugger = new Slugger();

	return input.children
		.filter((node) => node.type === "heading")
		.map((node) => {
			if (node.depth > 3) return undefined;

			let text = "";
			let child = node.children[0];

			while (true) {
				if (!child) return undefined;

				if (child.type === "text") {
					text = child.value;
					break;
				}

				if (!("children" in child) || child.children.length === 0) {
					return undefined;
				}

				child = child.children[0];
			}
			const isSrOnly = srOnlyRegex.test(text);
			if (isSrOnly) {
				return undefined;
			}
			const slug = getCustomId(text) || slugger.slug(text);
			text = text.replace(headingAttrRegex, "").trim();

			return {
				depth: node.depth,
				text,
				slug,
			};
		})
		.filter((heading) => heading !== undefined);
};

function getCustomId(headingText: string): string | null {
	const match = headingText.match(/\{#([^.\s}]+)\}/);
	return match?.[1] || null;
}

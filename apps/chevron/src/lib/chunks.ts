import { Page } from "contentlayer/generated";
import { parse } from "node-html-parser";
import "server-only";
const regex = /data-subsection-id\s*=\s*"(.*?)"/;

export const getPageChunks = (page: Page) => {
	const body = parse(page.body.raw);
	const chunks: string[] = [];
	body.childNodes.forEach((el) => {
		if ("rawAttrs" in el && typeof el.rawAttrs === "string") {
			const match = el.rawAttrs.match(regex);
			if (match) {
				chunks.push(match[1]);
			}
		}
	});

	return chunks;
};

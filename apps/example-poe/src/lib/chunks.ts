"use server";
import { Page } from "contentlayer/generated";
import { parse } from "node-html-parser";
const regex = /data-subsection-id\s*=\s*"(.*?)"/;

export const getPageChunks = (page: Page) => {
	const body = parse(page.body.raw);
	// parse("<p class = 'hello'>world</p>").childNodes.forEach((el) =>
	// 	console.log(el),
	// );
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

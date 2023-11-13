import { allChapters } from "contentlayer/generated";

export const allChaptersSorted = allChapters
	.slice()
	.sort((a, b) => a.chapter - b.chapter);

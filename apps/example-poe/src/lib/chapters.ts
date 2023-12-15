import { allChapters } from "contentlayer/generated";

export const allChaptersSorted = allChapters
	.slice()
	.sort((a, b) => a.chapter - b.chapter);

export const isLastChapter = (chapter: number) => {
	return chapter === allChaptersSorted[allChaptersSorted.length - 1].chapter;
};

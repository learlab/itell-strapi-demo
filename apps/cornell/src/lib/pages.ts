import { allPages } from "contentlayer/generated";

export const allPagesSorted = allPages.slice(0).sort((a, b) => {
	return a.chapter - b.chapter;
});

export const firstPage = allPagesSorted[0];

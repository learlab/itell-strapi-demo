import { allPages } from "contentlayer/generated";

export const allPagesSorted = allPages.slice(0).sort((a, b) => {
	return a.location.module - b.location.module;
});

export const firstPage = allPagesSorted[0];

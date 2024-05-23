import { groupby } from "@itell/core/utils";
import { allPages } from "contentlayer/generated";

export const allPagesSorted = allPages.sort((a, b) => {
	if (a.chapter !== b.chapter) {
		return a.chapter - b.chapter;
	}

	return a.section - b.section;
});

export const firstPage = allPagesSorted[0];
export const firstSummaryPage = allPagesSorted[1];

export const isLastPage = (slug: string) => {
	const lastPage = allPagesSorted[allPagesSorted.length - 1];
	return lastPage.page_slug === slug;
};

export const isPageAfter = (a: string | undefined, b: string | null) => {
	const aIndex = allPagesSorted.findIndex((s) => s.page_slug === a);
	const bIndex = allPagesSorted.findIndex((s) => s.page_slug === b);

	return aIndex > bIndex;
};

export const nextPage = (slug: string): string => {
	const currentPageIndex = allPagesSorted.findIndex(
		(s) => s.page_slug === slug,
	);

	// If current page is the last one or not found, return the same location
	if (
		currentPageIndex === -1 ||
		currentPageIndex === allPagesSorted.length - 1
	) {
		return slug;
	}

	// Get the next page
	const nextPage = allPagesSorted[currentPageIndex + 1];

	if (nextPage) {
		if (nextPage.summary) {
			return nextPage.page_slug;
		}

		// find the next page that requires a summary
		const nextPageWithSummary = allPagesSorted
			.slice(currentPageIndex + 1)
			.find((s) => s.summary);
		if (nextPageWithSummary) {
			return nextPageWithSummary.page_slug;
		}
		return slug;
	}

	return slug;
};

type TocItem = {
	title: string;
	chapter: number;
	section: number;
	page_slug: string;
};
const byChapter = groupby(allPagesSorted, (page) => page.chapter);
export const tocChapters: Array<{
	title: string;
	chapter: number;
	page_slug: string;
	items: Array<TocItem>;
}> = [];
for (const chapter of Object.keys(byChapter)) {
	const pages = byChapter[chapter];
	const firstPage = pages[0];
	tocChapters.push({
		title: firstPage.title,
		chapter: firstPage.chapter,
		page_slug: firstPage.page_slug,
		items: pages.slice(1).map((page) => ({
			title: page.title,
			chapter: page.chapter,
			section: page.section,
			page_slug: page.page_slug,
		})),
	});
}

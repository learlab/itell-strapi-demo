import { pages } from "#content";

export const allPagesSorted = pages.sort((a, b) => {
	return a.order - b.order;
});

export const allSummaryPagesSorted = allPagesSorted.filter((page) =>
	page.assignments.includes("summary"),
);
export const firstSummaryPage = allSummaryPagesSorted.find((page) =>
	page.assignments.includes("summary"),
);
export const firstPage = firstSummaryPage || allPagesSorted[0];

export const isLastPage = (slug: string) => {
	const lastPage = allPagesSorted[allPagesSorted.length - 1];
	return lastPage.slug === slug;
};

export const isPageAfter = (a: string | undefined, b: string | null) => {
	const aIndex = allPagesSorted.findIndex((s) => s.slug === a);
	const bIndex = allPagesSorted.findIndex((s) => s.slug === b);

	return aIndex > bIndex;
};

export const nextPage = (slug: string): string => {
	const currentPageIndex = allPagesSorted.findIndex((s) => s.slug === slug);

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
			return nextPage.slug;
		}

		// find the next page that requires a summary
		const nextPageWithSummary = allPagesSorted
			.slice(currentPageIndex + 1)
			.find((s) => s.summary);
		if (nextPageWithSummary) {
			return nextPageWithSummary.slug;
		}
		return slug;
	}

	return slug;
};

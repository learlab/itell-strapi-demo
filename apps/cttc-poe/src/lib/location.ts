import { allPagesSorted } from "./pages";

// returns the slug for the new section
export const nextPage = (slug: string): string => {
	const currentSectionIndex = allPagesSorted.findIndex(
		(s) => s.page_slug === slug,
	);

	// If current section is the last one or not found, return the same location
	if (
		currentSectionIndex === -1 ||
		currentSectionIndex === allPagesSorted.length - 1
	) {
		return slug;
	}

	// Get the next section
	const nextSection = allPagesSorted[currentSectionIndex + 1];

	if (nextSection) {
		if (nextSection.summary) {
			return nextSection.page_slug;
		}

		// find the next section that requires a summary
		const nextSectionWithSummary = allPagesSorted
			.slice(currentSectionIndex + 1)
			.find((s) => s.summary);
		if (nextSectionWithSummary) {
			return nextSectionWithSummary.page_slug;
		}
		return slug;
	}

	return slug;
};

export const isPageUnlockedWithoutUser = (slug: string) => {
	return slug === "introduction-to-law-and-legal-systems";
};

export const isPageAfter = (a: string | null, b: string | null) => {
	const aIndex = allPagesSorted.findIndex((s) => s.page_slug === a);
	const bIndex = allPagesSorted.findIndex((s) => s.page_slug === b);

	return aIndex > bIndex;
};

export const isLastPage = (slug: string) => {
	const lastSection = allPagesSorted[allPagesSorted.length - 1];
	return lastSection.page_slug === slug;
};

import { firstPage, firstSummaryPage, isLastPage, isPageAfter } from "./pages";

const isPageUnlockedWithoutUser = (pageSlug: string) => {
	return pageSlug === firstPage.page_slug;
};

export type PageStatus = {
	// if user has completed the page
	isPageUnlocked: boolean;
	// if page is user's current one
	isPageLatest: boolean;
};

export const getPageStatus = ({
	pageSlug,
	userPageSlug,
	userFinished,
}: {
	pageSlug: string;
	userPageSlug: string | null;
	userFinished: boolean;
}): PageStatus => {
	if (!userPageSlug) {
		return {
			isPageUnlocked: isPageUnlockedWithoutUser(pageSlug),
			isPageLatest:
				pageSlug === firstPage.page_slug ||
				pageSlug === firstSummaryPage.page_slug,
		};
	}

	const isPageLatest = pageSlug === userPageSlug;
	if (isPageUnlockedWithoutUser(pageSlug)) {
		return { isPageUnlocked: true, isPageLatest };
	}

	const isPageUnlocked = isLastPage(pageSlug)
		? userFinished
		: isPageAfter(userPageSlug, pageSlug);
	return { isPageUnlocked, isPageLatest };
};

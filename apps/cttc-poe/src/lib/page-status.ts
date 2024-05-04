import { firstPage, isPageAfter } from "./pages";

const isPageUnlockedWithoutUser = (pageSlug: string) => {
	return pageSlug === "introduction-to-the-macroeconomic-perspective";
};

export type PageStatus = {
	// if user has completed the page
	isPageUnlocked: boolean;
	// if page is user's current one
	isPageLatest: boolean;
};

export const getPageStatus = (
	pageSlug: string,
	userPageSlug: string | null | undefined,
): PageStatus => {
	if (!userPageSlug) {
		return {
			isPageUnlocked: isPageUnlockedWithoutUser(pageSlug),
			isPageLatest: pageSlug === firstPage.page_slug,
		};
	}

	if (isPageUnlockedWithoutUser(pageSlug)) {
		return { isPageUnlocked: true, isPageLatest: pageSlug === userPageSlug };
	}

	const isPageLatest = pageSlug === userPageSlug;
	const isPageUnlocked = isPageAfter(userPageSlug, pageSlug);
	return { isPageUnlocked, isPageLatest };
};

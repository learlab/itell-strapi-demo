import { isPageAfter, isPageUnlockedWithoutUser } from "./location";

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
		const isPageUnlocked = isPageUnlockedWithoutUser(pageSlug);
		return { isPageUnlocked, isPageLatest: false };
	}

	const isPageLatest = pageSlug === userPageSlug;
	const isPageUnlocked = isPageAfter(userPageSlug, pageSlug);
	return { isPageUnlocked, isPageLatest };
};

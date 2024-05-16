import { SessionUser } from "./auth";
import { firstPage, isLastPage, isPageAfter } from "./pages";

const isPageUnlockedWithoutUser = (pageSlug: string) => {
	return false;
};

export type PageStatus = {
	// if user has completed the page
	isPageUnlocked: boolean;
	// if page is user's current one
	isPageLatest: boolean;
};

export const getPageStatus = (
	user: SessionUser,
	pageSlug: string,
): PageStatus => {
	if (!user?.pageSlug) {
		return {
			isPageUnlocked: isPageUnlockedWithoutUser(pageSlug),
			isPageLatest: pageSlug === firstPage.page_slug,
		};
	}

	if (isPageUnlockedWithoutUser(pageSlug)) {
		return { isPageUnlocked: true, isPageLatest: pageSlug === user?.email };
	}

	const isPageLatest = pageSlug === user.pageSlug;
	const isPageUnlocked = isLastPage(pageSlug)
		? user.finished
		: isPageAfter(user.pageSlug, pageSlug);
	return { isPageUnlocked, isPageLatest };
};

import { SessionUser } from "./auth";
import { firstPage, isLastPage, isPageAfter } from "./pages";

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
	user: SessionUser,
	pageSlug: string,
): PageStatus => {
	if (!user?.page_slug) {
		return {
			isPageUnlocked: isPageUnlockedWithoutUser(pageSlug),
			isPageLatest: pageSlug === firstPage.page_slug,
		};
	}

	if (isPageUnlockedWithoutUser(pageSlug)) {
		return { isPageUnlocked: true, isPageLatest: pageSlug === user?.email };
	}

	const isPageLatest = pageSlug === user.page_slug;
	const isPageUnlocked = isLastPage(pageSlug)
		? user.finished
		: isPageAfter(user.page_slug, pageSlug);
	return { isPageUnlocked, isPageLatest };
};

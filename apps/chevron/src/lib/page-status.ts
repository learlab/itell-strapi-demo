import { firstPage, firstSummaryPage, isLastPage, isPageAfter } from "./pages";

const isPageUnlockedWithoutUser = (pageSlug: string) => {
	return false;
};

export type PageStatus = {
	// if user has completed the page
	unlocked: boolean;
	// if page is user's current one
	latest: boolean;
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
	if (userFinished) {
		return { unlocked: true, latest: pageSlug === userPageSlug };
	}

	if (!userPageSlug) {
		return {
			unlocked: isPageUnlockedWithoutUser(pageSlug),
			latest:
				pageSlug === firstPage.page_slug ||
				pageSlug === firstSummaryPage.page_slug,
		};
	}

	const latest = pageSlug === userPageSlug;
	if (isPageUnlockedWithoutUser(pageSlug)) {
		return { unlocked: true, latest };
	}

	const unlocked = isLastPage(pageSlug)
		? userFinished
		: isPageAfter(userPageSlug, pageSlug);
	return { unlocked, latest };
};

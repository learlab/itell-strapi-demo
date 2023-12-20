import type { PageLinkData } from "@itell/ui/client";
import { allPagesSorted } from "./pages";
import { PageData, getPageData } from "./utils";

export const getPagerLinks = ({
	pageIndex,
	userPageSlug,
}: { pageIndex: number; userPageSlug: string | null }) => {
	const links: { prev: PageLinkData | null; next: PageLinkData | null } = {
		prev: null,
		next: null,
	};

	const userPage = getPageData(userPageSlug);
	if (pageIndex > 0) {
		const page = allPagesSorted[pageIndex - 1];
		const disabled = userPageSlug
			? userPage.index < pageIndex - 1
			: pageIndex < 2
			  ? false
			  : true;
		links.prev = {
			text: `${page.location.chapter}.${page.location.section} ${page.title}`,
			href: page.url,
			disabled,
		};
	}

	if (pageIndex < allPagesSorted.length - 1) {
		const page = allPagesSorted[pageIndex + 1];
		const disabled = userPageSlug
			? userPage.index < pageIndex + 1
			: pageIndex === 0
			  ? false
			  : true;
		links.next = {
			text: `${page.location.chapter}.${page.location.section} ${page.title}`,
			href: page.url,
			disabled,
		};
	}

	return links;
};

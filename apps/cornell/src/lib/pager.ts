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

	if (!userPage) {
		const nextPage =
			pageIndex + 1 < allPagesSorted.length - 1
				? allPagesSorted[pageIndex + 1]
				: null;
		const prevPage = pageIndex > 0 ? allPagesSorted[pageIndex - 1] : null;

		links.next = nextPage
			? {
					text: `${nextPage.chapter + 1}. ${nextPage.title}`,
					href: nextPage.url,
					disabled: false,
			  }
			: null;

		links.prev = prevPage
			? {
					text: `${prevPage.chapter + 1}. ${prevPage.title}`,
					href: prevPage.url,
					disabled: false,
			  }
			: null;

		return links;
	}

	if (pageIndex > 0) {
		const page = allPagesSorted[pageIndex - 1];
		const disabled = userPageSlug
			? userPage.index < pageIndex - 1
			: pageIndex < 2
			  ? false
			  : true;
		links.prev = {
			text: `${page.chapter + 1}. ${page.title}`,
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
			text: `${page.chapter + 1}. ${page.title}`,
			href: page.url,
			disabled,
		};
	}

	return links;
};

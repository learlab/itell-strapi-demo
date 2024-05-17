import type { PageLinkData } from "@itell/ui/client";
import { allPagesSorted } from "./pages";
import { PageData, getPageData } from "./utils";

export const getPagerLinks = ({
	pageIndex,
	userPageSlug,
}: { pageIndex: number; userPageSlug: string | undefined | null }) => {
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
					text: nextPage.title,
					href: nextPage.url,
					disabled: false,
				}
			: null;

		links.prev = prevPage
			? {
					text: prevPage.title,
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
			: !(pageIndex < 2);
		links.prev = {
			text: page.title,
			href: page.url,
			disabled,
		};
	}

	if (pageIndex < allPagesSorted.length - 1) {
		const page = allPagesSorted[pageIndex + 1];
		const disabled = userPageSlug
			? userPage.index < pageIndex + 1
			: pageIndex !== 0;
		links.next = {
			text: page.title,
			href: page.url,
			disabled,
		};
	}

	return links;
};

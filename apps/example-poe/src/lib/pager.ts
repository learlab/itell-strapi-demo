import type { PageLinkData } from "@itell/ui/client";
import { allSections } from "contentlayer/generated";
import { allSectionsSorted } from "./sections";
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
		const section = allSectionsSorted[pageIndex - 1];
		const disabled = userPageSlug
			? userPage.index < pageIndex - 1
			: pageIndex < 2
			  ? false
			  : true;
		links.prev = {
			text: `${section.location.chapter}.${section.location.section} ${section.title}`,
			href: section.url,
			disabled,
		};
	}

	if (pageIndex < allSections.length - 1) {
		const section = allSectionsSorted[pageIndex + 1];
		const disabled = userPageSlug
			? userPage.index < pageIndex + 1
			: pageIndex === 0
			  ? false
			  : true;
		links.next = {
			text: `${section.location.chapter}.${section.location.section} ${section.title}`,
			href: section.url,
			disabled,
		};
	}

	return links;
};

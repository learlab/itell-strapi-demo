import type { PageLinkData } from "@itell/ui/client";
import { allSections } from "contentlayer/generated";
import { allSectionsSorted } from "./sections";

export const getPagerLinksForSection = (index: number) => {
	const links: { prev: PageLinkData | null; next: PageLinkData | null } = {
		prev: null,
		next: null,
	};

	if (index !== 0) {
		const section = allSectionsSorted[index - 1];
		links.prev = {
			text: `${section.location.chapter}.${section.location.section} ${section.title}`,
			href: section.url,
		};
	}

	if (index !== allSections.length - 1) {
		const section = allSectionsSorted[index + 1];
		links.next = {
			text: `${section.location.chapter}.${section.location.section} ${section.title}`,
			href: section.url,
		};
	}

	return links;
};

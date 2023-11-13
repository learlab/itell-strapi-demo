import { Chapter } from "contentlayer/generated";
import { allChaptersSorted } from "./chapters";
import type { PageLinkData } from "@itell/ui/client";

export const getPagerLinksForChapter = (index: number) => {
	const pagerData: { prev: PageLinkData | null; next: PageLinkData | null } = {
		prev: null,
		next: null,
	};

	if (index !== 0) {
		const chapter = allChaptersSorted[index - 1];
		pagerData.prev = {
			text: `${chapter.chapter}. ${chapter.title}`,
			href: `/${chapter.url}`,
		};
	}

	if (index !== allChaptersSorted.length - 1) {
		const chapter = allChaptersSorted[index + 1];
		pagerData.next = {
			text: `${chapter.chapter}. ${chapter.title}`,
			href: `/${chapter.url}`,
		};
	}

	return pagerData;
};

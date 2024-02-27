import { Chapter, SidebarSection } from "@/types/section";
import { groupby } from "@itell/core/utils";
import {
	isPageAfter,
	isPageUnlockedWithoutUser,
	isPageVisibleWithoutUser,
} from "./location";
import { allPagesSorted } from "./pages";
import { sortSections } from "./utils";

export const getModuleChapters = (
	module: number,
	userPageSlug: string | null | undefined,
) => {
	const sections: SidebarSection[] = allPagesSorted
		.filter((section) => section.location.module === module)
		.map((section) => ({
			id: section._id,
			title: section.title,
			slug: section.page_slug,
			url: section.url,
			chapter: section.location.chapter,
			section: section.location.section,
			visible: userPageSlug
				? !isPageAfter(section.page_slug, userPageSlug)
				: isPageVisibleWithoutUser(section.page_slug),
		}));

	const sectionsSorted = sortSections(sections);

	const result = groupby(sectionsSorted, (section) => section.chapter);
	const output: Chapter[] = [];
	for (const [key, value] of Object.entries(result)) {
		output.push({
			chapter: Number(key),
			title: value[0].title,
			url: value[0].url,
			visible: value[0].visible,
			sections: value.splice(1),
		});
	}

	return output;
};

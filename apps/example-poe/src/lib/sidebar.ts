import { Section } from "contentlayer/generated";
import { Chapter, SidebarSection } from "@/types/section";
import { sortSections } from "./utils";
import { groupby } from "@itell/core/utils";

export default async function getChapters({
	allSections,
	module,
}: {
	allSections: Section[];
	module: number;
}) {
	const sections: SidebarSection[] = allSections
		.filter((section) => section.location.module === module)
		.map((section) => ({
			id: section._id,
			title: section.title,
			chapter: section.location.chapter,
			section: section.location.section,
			url: section.url,
		}));

	const sectionsSorted = sortSections(sections);

	const result = groupby(sectionsSorted, (section) => section.chapter);
	const output: Chapter[] = [];
	for (const [key, value] of Object.entries(result)) {
		output.push({
			chapter: Number(key),
			title: value[0].title,
			url: value[0].url,
			sections: value.splice(1),
		});
	}

	return output;
}

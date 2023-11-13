import { Location, SectionLocation } from "@/types/location";
import { SidebarSection } from "@/types/section";

export const getYoutubeLinkFromEmbed = (url: string) => {
	const regex = /embed\/([\w-]+)\?/;
	const match = url.match(regex);

	if (match) {
		return `https://www.youtube.com/watch?v=${match[1]}`;
	}

	return url;
};

const getSingleLocation = (s: string | undefined) => {
	if (!s) return undefined;
	const [_, number] = s.split("-");
	return number ? Number(number) : undefined;
};
export const getLocationFromPathname = (path: string): Location => {
	const pathname = path.split("/");

	const module = getSingleLocation(pathname[1]);
	const chapter = getSingleLocation(pathname[2]);
	let section = getSingleLocation(pathname[3]);
	if (module && chapter && !section) {
		section = 0;
	}
	return { module, chapter, section };
};

export const sortSections = (sections: SidebarSection[]) => {
	const sectionsSorted = sections.slice(0).sort((a, b) => {
		if (a.chapter === b.chapter) {
			if (!a.section) {
				return -1;
			}
			if (!b.section) {
				return 1;
			}

			return a.section - b.section;
		}
		return a.chapter - b.chapter;
	});

	return sectionsSorted;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const makeInputKey = (location: SectionLocation) => {
	return `chapter-${location.chapter}-section-${location.section}-summary`;
};

export const makeLocationHref = (location: SectionLocation) => {
	const sectionSlug = location.section ? `/section-${location.section}` : "";
	return `/module-${location.module}/chapter-${location.chapter}${sectionSlug}`;
};

export const isTextbookPage = (location: Location) => {
	return (
		location.module !== undefined &&
		location.chapter !== undefined &&
		location.section !== undefined
	);
};

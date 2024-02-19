import { Location } from "@/types/location";
import { SidebarSection } from "@/types/section";
import { redirect } from "next/navigation";
import { allPagesSorted } from "./pages";

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

export const makeInputKey = (slug: string) => {
	return `${slug}-summary`;
};

export const makePageHref = (slug: string) => {
	return `/${slug}`;
};

export type PageData = {
	id: string;
	index: number;
	title: string;
	page_slug: string;
	quiz: boolean;
	chapter: number;
	section: number;
	nextPageSlug: string | null;
};

export const getPageData = (slug: string | null): PageData | null => {
	const index = allPagesSorted.findIndex((s) => s.page_slug === slug);
	if (index === -1) {
		return null;
	}
	const page = allPagesSorted[index];

	const nextPageSlug =
		index !== allPagesSorted.length - 1
			? allPagesSorted[index + 1]?.page_slug
			: null;

	return {
		id: page._id,
		index,
		title: page.title,
		page_slug: page.page_slug,
		chapter: page.location.chapter as number,
		section: page.location.section as number,
		quiz: page.quiz,
		nextPageSlug,
	};
};

export const getChunkElement = (chunkId: string) => {
	return document.querySelector(
		`div[data-subsection-id='${chunkId}']`,
	) as HTMLDivElement;
};

export const redirectWithSearchParams = (
	path: string,
	searchParams?: Record<string, string>,
) => {
	const query = new URLSearchParams(searchParams).toString();
	return redirect(`${path}?${query}`);
};

export const showSiteNav = () => {
	document.getElementById("site-nav")?.classList.remove("hidden");
};

export const hideSiteNav = () => {
	document.getElementById("site-nav")?.classList.add("hidden");
};

export const scrollToElement = (element: HTMLElement) => {
	// offset to account for the sticky header
	const yOffset = -70;
	const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

	window.scrollTo({ top: y, behavior: "smooth" });
};

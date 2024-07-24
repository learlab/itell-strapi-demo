import { env } from "@/env.mjs";
import * as Sentry from "@sentry/nextjs";
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

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const makeInputKey = (slug: string) => {
	return `${slug}-summary`;
};

export const makePageHref = (slug: string, chunk?: string) => {
	return `/${slug}${chunk ? `#${chunk}` : ""}`;
};

export type PageData = {
	id: string;
	index: number;
	title: string;
	page_slug: string;
	chapter: number;
	referenceSummary: string | undefined;
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
		chapter: page.chapter,
		referenceSummary: page.reference_summary,
		nextPageSlug,
	};
};

export const getChunkElement = (chunkSlug: string): HTMLElement | null => {
	const el = document.querySelector(
		`section[data-subsection-id='${chunkSlug}']`,
	);
	if (el instanceof HTMLElement) {
		return el;
	}

	return null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== undefined;
}

export const redirectWithSearchParams = (
	path: string,
	searchParams?: unknown,
) => {
	const url = new URL(path, env.NEXTAUTH_URL);
	if (isRecord(searchParams)) {
		for (const key in searchParams) {
			url.searchParams.append(key, String(searchParams[key]));
		}
	}
	return redirect(url.toString());
};

export const scrollToElement = (element: HTMLElement) => {
	// offset to account for the sticky header
	const yOffset = -70;
	const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

	window.scrollTo({ top: y, behavior: "smooth" });
};

export const reportSentry = (msg: string, extra: any) => {
	console.log("reporting to sentry", msg, extra);
	Sentry.captureMessage(msg, {
		extra,
	});
};

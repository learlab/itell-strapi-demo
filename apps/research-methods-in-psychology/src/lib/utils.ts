import { env } from "@/env.mjs";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { Page } from "#content";
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
	slug: string;
	order: number;
	quiz: Page["quiz"];
	next_slug: string | null;
};

export const getPageData = (slug: string | null): PageData | null => {
	const index = allPagesSorted.findIndex((s) => s.slug === slug);
	if (index === -1) {
		return null;
	}
	const page = allPagesSorted[index];

	return {
		id: page.title,
		index,
		title: page.title,
		slug: page.slug,
		next_slug: page.next_slug,
		order: page.order,
		quiz: page.quiz,
	};
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== undefined;
}

export const redirectWithSearchParams = (
	path: string,
	searchParams?: unknown,
) => {
	const url = new URL(path, env.NEXT_PUBLIC_HOST);
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

export const insertNewline = (textarea: HTMLTextAreaElement) => {
	textarea.value = `${textarea.value}\n`;
	textarea.selectionStart = textarea.value.length;
	textarea.selectionEnd = textarea.value.length;
};

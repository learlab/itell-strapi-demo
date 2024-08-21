import {
	APIResponseCollection,
	ApiResponseChunk,
	ApiResponsePage,
	ApiResponsePages,
	ApiResponseVolumes,
} from "@/types/types";
import qs from "qs";
import { cache } from "react";

const base = "https://itell-strapi-um5h.onrender.com/api";

export type SearchPageResult = {
	id: number;
	title: string;
	volume?: string | null;
	slug: string;
};

export type Volume = {
	title: string;
	slug: string | undefined;
};
export const searchVolumes = cache(async () => {
	const response = await fetch(`${base}/texts`);
	if (!response.ok) {
		return null;
	}
	const { data } = (await response.json()) as ApiResponseVolumes;
	return data.map((text) => ({
		title: text.attributes.Title,
		slug: text.attributes.Slug,
	}));
});

export const searchPages = cache(
	async ({
		volumeSlug,
	}: { volumeSlug: string }): Promise<SearchPageResult[] | null> => {
		const filters = qs.stringify({
			fields: ["id", "Title", "Slug"],
			filters: {
				Volume: {
					Slug: {
						$eq: volumeSlug,
					},
				},
			},
		});
		const response = await fetch(`${base}/pages?${filters}`);
		if (!response.ok) {
			return null;
		}

		const { data } =
			(await response.json()) as APIResponseCollection<"api::page.page">;
		return data.map((page) => ({
			id: page.id,
			title: page.attributes.Title,
			slug: page.attributes.Slug,
		}));
	},
);

export const searchPage = cache(
	async (slug: string): Promise<SearchPageResult | null> => {
		const filters = qs.stringify({
			filters: {
				Slug: {
					$eq: slug,
				},
			},
		});

		const response = await fetch(`${base}/pages?${filters}`);
		if (!response.ok) {
			return null;
		}

		const { data } = (await response.json()) as ApiResponsePages;
		if (data.length === 0) {
			return null;
		}

		const id = data[0].id;
		const pageFilter = qs.stringify({
			fields: ["id", "Title", "Slug"],
			populate: {
				Volume: true,
			},
		});
		const page = await fetch(`${base}/pages/${id}?${pageFilter})}`);
		const { data: pageData } = (await page.json()) as ApiResponsePage;
		return {
			id: pageData.id,
			title: pageData.attributes.Title,
			slug: pageData.attributes.Slug,
			volume: pageData.attributes.Volume?.data.attributes?.Title || null,
		};
	},
);

export type PageData = {
	id: number;
	title: string;
	volume: string | null;
	content: string[];
};

const pageFilter = qs.stringify({
	fields: ["Title", "Slug"],
	populate: {
		Content: { fields: ["*"] },
		Chunk: { fields: ["*"] },
		Volume: true,
	},
});
export const getPage = cache(async (id: number) => {
	const response = await fetch(`${base}/pages/${id}?${pageFilter}`);
	if (!response.ok) {
		return null;
	}

	const { data } = (await response.json()) as ApiResponsePage;
	return {
		id: data.id,
		title: data.attributes.Title,
		volume: data.attributes.Volume?.data.attributes?.Title || null,
		content:
			data.attributes.Content?.map((chunk) =>
				getChunkContent(chunk, data.attributes.Slug),
			) || [],
	};
});

const getChunkContent = (chunk: any, pageSlug: string) => {
	const question = chunk.Question;
	const answer = chunk.ConstructedResponse;
	const cri =
		question && answer
			? `\n<i-question question='${question}' answer='${answer}' page-slug='${pageSlug}' chunk-slug='${chunk.Slug}' >\n</i-question>`
			: "";

	const heading = `## ${chunk.Header} {#${chunk.Slug}${chunk.ShowHeader ? "" : " .sr-only"}}`;
	return `${heading}\n${chunk.MDX}${cri}`;
};

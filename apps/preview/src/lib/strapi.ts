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
	slug: string;
};
export const searchVolumes = cache(async () => {
	const response = await fetch(`${base}/texts`);
	if (!response.ok) {
		return null;
	}
	const { data } = await response.json();
	return data.map((text: any) => ({
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

		const { data } = await response.json();
		return data.map((page: any) => ({
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

		const data = await response.json();
		if (data.data.length === 0) {
			return null;
		}

		const id = data.data[0].id;
		const pageFilter = qs.stringify({
			fields: ["id", "Title", "Slug"],
			populate: {
				Volume: true,
				// Content: { fields: ["*"] },
				// Chunk: { fields: ["*"] },
			},
		});
		const page = await fetch(`${base}/pages/${id}?${pageFilter})}`);
		const pageData = await page.json();
		if (!("data" in pageData)) {
			return null;
		}
		const pageAttr = pageData.data.attributes;
		return {
			id: pageData.data.id,
			title: pageAttr.Title,
			slug: pageAttr.Slug,
			volume: pageAttr.Volume?.data.attributes?.Title || null,
		};
	},
);

export type PageData = {
	id: number;
	title: string;
	volume: string | null;
	content: string[];
};

export const getPage = async (id: number) => {
	const pageFilter = qs.stringify({
		fields: ["Title"],
		populate: {
			Content: { fields: ["*"] },
			Chunk: { fields: ["*"] },
			Volume: true,
		},
	});
	const response = await fetch(`${base}/pages/${id}?${pageFilter}`);
	if (!response.ok) {
		return null;
	}

	const { data } = await response.json();
	return {
		id: data.id,
		title: data.attributes.Title,
		volume: data.attributes.Volume?.data.attributes?.Title || null,
		content: data.attributes.Content.map((chunk: any) => chunk.MDX),
	};
};

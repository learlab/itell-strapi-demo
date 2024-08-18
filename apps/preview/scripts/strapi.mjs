import qs from "qs";

const pageSlug = "2-understanding-science";
const base = "https://itell-strapi-um5h.onrender.com/api";
const filters = qs.stringify({
	filters: {
		Slug: {
			$eq: pageSlug,
		},
	},
});
const fetchPageBySlug = async () => {
	const response = await fetch(`${base}/pages?${filters}`);

	if (response.ok) {
		const data = await response.json();
		const id = data.data[0].id;
		const pageFilter = qs.stringify({
			// fields: ["Title", "Slug"],
			populate: {
				// Content: { fields: ["*"] },
				// Chunk: { fields: ["*"] },
				Volume: true,
			},
		});
		const page = await fetch(`${base}/pages/${id}?${pageFilter})}`);
		const pageData = await page.json();
		console.log(pageData.data.attributes);
	}
};

const volumeFilter = qs.stringify({
	populate: {
		Pages: {
			fields: ["*"],
			populate: {
				Content: true,
			},
		},
	},
});

const fetchVolume = async () => {
	console.log(`${base}/texts/10?${volumeFilter}`);
	const response = await fetch(`${base}/texts/10?${volumeFilter}`);
	const data = await response.json();
	data.data.attributes.Pages.data.forEach((page, index) => {
		if (index === 0) {
			console.log(page.attributes.Content[0]);
			console.log(Object.keys(page.attributes));
			// console.log(page.attributes.Content[0]);
		}
	});
};

fetchVolume();

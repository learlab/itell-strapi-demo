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
const fetchContent = async () => {
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

fetchContent();

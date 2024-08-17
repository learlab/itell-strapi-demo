export const rewriteSearchParams = (
	url: URL,
	params: Record<string, string>,
) => {
	const searchParams = url.searchParams;
	for (const [key] of searchParams.entries()) {
		searchParams.delete(key);
	}

	for (const [key, value] of Object.entries(params)) {
		searchParams.set(key, value);
	}
};

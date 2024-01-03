export const getChunks = () => {
	const chunks = Array.from(
		document.querySelectorAll("#page-content .content-chunk"),
	) as HTMLDivElement[];
	return chunks;
};

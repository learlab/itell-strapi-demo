export const getPageChunks = (raw: string) => {
	const contentChunkRegex =
		/<div\s+className="content-chunk"\s+data-subsection-id\s*=\s*"([^"]+)"/g;
	const chunks: string[] = [];

	const matches = raw.matchAll(contentChunkRegex);

	for (const match of matches) {
		if (match[1]) {
			chunks.push(match[1]);
		}
	}

	return chunks;
};

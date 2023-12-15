export const getYoutubeLinkFromEmbed = (url: string) => {
	const regex = /embed\/([\w-]+)\?/;
	const match = url.match(regex);

	if (match) {
		return `https://www.youtube.com/watch?v=${match[1]}`;
	}

	return url;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const makeInputKey = (chapter: number) => {
	return `think-python-chapter-${chapter}-summary`;
};

export const makeChapterHref = (chapter: number) => {
	return `/chapter-${chapter}`;
};

export const getChapterFromPathname = (pathname: string) => {
	const pathSplitted = pathname.split("-");
	return Number(pathSplitted[1]);
};

export const getCurrentChunkLocal = () => {
	const chapter = getChapterFromPathname(location.pathname);
	const key = `current-chunk-chapter-${chapter}`;
	const val = localStorage.getItem(key);
	return val ? Number(localStorage.getItem(key)) : 0;
};

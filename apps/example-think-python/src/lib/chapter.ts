export const isChapterUnlockedWithoutUser = (chapter: number) => {
	return chapter === 1 || chapter === 0;
};

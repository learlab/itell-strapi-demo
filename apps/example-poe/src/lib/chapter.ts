import { allChaptersSorted } from "./chapters";
import { readClassSettings } from "./class";

export const isChapterUnlockedWithoutUser = (chapter: number) => {
	return chapter === 1 || chapter === 0;
};

export const isChapterWithFeedback = (chapter: number) => {
	const classSettings = readClassSettings();

	if (!classSettings) {
		return true;
	}

	return !classSettings.no_feedback_pages?.includes(chapter);
};

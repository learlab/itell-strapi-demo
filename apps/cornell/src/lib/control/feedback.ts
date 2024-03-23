import { Page } from "contentlayer/generated";
import { FeedbackType } from "../store/config";

export const getPageFeedbackType = (page: Page): FeedbackType => {
	if (page.chapter === 0) {
		return "simple";
	}

	if (page.chapter === 1) {
		return "stairs";
	}

	if (page.chapter === 2) {
		return "simple";
	}

	if (page.chapter === 3) {
		return "stairs";
	}

	return "stairs";
};

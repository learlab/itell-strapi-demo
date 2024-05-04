import { Page } from "contentlayer/generated";

export enum FeedbackType {
	SIMPLE = "simple",
	RANDOM_REREAD = "random_reread",
	STAIRS = "stairs",
}

export const getPageFeedbackType = (page: Page): FeedbackType => {
	return FeedbackType.STAIRS;
};

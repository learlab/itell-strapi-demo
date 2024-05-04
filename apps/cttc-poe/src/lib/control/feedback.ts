import { Page } from "contentlayer/generated";
import { FeedbackType } from "../store/config";

export const getPageFeedbackType = (page: Page): FeedbackType => {
	return "stairs";
};

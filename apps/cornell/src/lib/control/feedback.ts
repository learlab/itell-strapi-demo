import { Page } from "contentlayer/generated";
import { Session } from "next-auth";

export const isPageWithFeedback = (user: Session["user"], page: Page) => {
	return true;
};

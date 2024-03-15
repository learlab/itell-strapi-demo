import { Page } from "contentlayer/generated";
import { Session } from "next-auth";

export const isPageWithFeedback = (user: Session["user"], page: Page) => {
	const userClass = user.class;
	const chapter = page.chapter;
	if (userClass === "one") {
		return chapter === 10 || chapter === 11;
	}

	if (userClass === "two") {
		return chapter === 12 || chapter === 13;
	}

	return true;
};

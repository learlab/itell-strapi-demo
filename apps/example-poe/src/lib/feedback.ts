import { Page } from "contentlayer/generated";
import { Session } from "next-auth";

export const isPageWithFeedback = (user: Session["user"], page: Page) => {
	const userClass = user.class;
	const module = page.location.module;
	if (module === 1) {
		return userClass === "one";
	}

	if (module === 2) {
		return userClass === "two";
	}

	return true;
};

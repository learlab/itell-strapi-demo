import { Page } from "contentlayer/generated";
import { Session } from "next-auth";

export const isPageWithFeedback = (user: Session["user"], page: Page) => {
	const userClass = user.class;
	const module = page.location.module;
	if (userClass === "one") {
		return module === 1;
	}

	if (module === "two") {
		return module === 2;
	}

	return true;
};

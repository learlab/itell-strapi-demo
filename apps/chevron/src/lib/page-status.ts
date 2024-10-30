import { getPageData, isLastPage } from "./pages/pages.client";
import {
  firstAssignmentPage,
  firstPage,
  isPageAfter,
} from "./pages/pages.server";

const isPageUnlockedWithoutUser = (pageSlug: string) => {
  return false;
  // return pageSlug === firstPage.slug;
};

export type PageStatus = {
  // if user has completed the page
  unlocked: boolean;
  // if page is user's current one
  latest: boolean;
};

export const getPageStatus = ({
  pageSlug,
  userPageSlug,
  userFinished,
}: {
  pageSlug: string;
  userPageSlug: string | null;
  userFinished: boolean;
}): PageStatus => {
  if (userFinished) {
    return { unlocked: true, latest: pageSlug === userPageSlug };
  }

  if (!userPageSlug) {
    return {
      unlocked: isPageUnlockedWithoutUser(pageSlug),
      latest:
        pageSlug ===
        (firstAssignmentPage ? firstAssignmentPage.slug : firstPage.slug),
    };
  }

  const latest = pageSlug === userPageSlug;
  if (isPageUnlockedWithoutUser(pageSlug)) {
    return { unlocked: true, latest };
  }

  const page = getPageData(pageSlug);
  if (!page) {
    return { unlocked: false, latest: false };
  }
  const unlocked = isLastPage(page)
    ? userFinished
    : isPageAfter(userPageSlug, pageSlug);
  return { unlocked, latest };
};

import { groupBy } from "es-toolkit";

import "server-only";

import { pages } from "#content";

export const allPagesSorted = pages.sort((a, b) => {
  return a.order - b.order;
});

export const allAssignmentPagesSorted = allPagesSorted.filter(
  (page) => page.assignments.length > 0
);
export const firstAssignmentPage = allAssignmentPagesSorted.find(
  (page) => page.assignments.length > 0
);
export const firstPage = allPagesSorted[0];

export const getPage = (slug: string) =>
  allPagesSorted.find((p) => p.slug === slug);

export const tocPages = pages.reduce<(TocPageItem | TocGroup)[]>(
  (acc, page) => {
    const item: TocPageItem = {
      group: false,
      title: page.title,
      slug: page.slug,
      href: page.href,
    };
    if (!page.parent) {
      acc.push(item);
      return acc;
    }

    // if page have a parent, treat it as the children of the latest group
    const group = acc.at(-1);
    if (group?.group && group.slug === page.parent.slug) {
      group.pages.push(item);
    } else {
      acc.push({
        group: true,
        slug: page.parent.slug,
        title: page.parent.title,
        pages: [item],
      });
    }

    return acc;
  },
  []
);

export type TocPageItem = {
  group: false;
  title: string;
  slug: string;
  href: string;
};

type TocGroup = {
  group: true;
  title: string;
  slug: string;
  pages: TocPageItem[];
};

export const pagesByParent = groupBy(
  pages.map((page) => ({
    parentTitle: page.parent?.title ?? "root",
    title: page.title,
    slug: page.slug,
    href: page.href,
  })),
  (page) => page.parentTitle
);

export const isPageAfter = (a: string | undefined, b: string | null) => {
  const aIndex = allPagesSorted.findIndex((s) => s.slug === a);
  const bIndex = allPagesSorted.findIndex((s) => s.slug === b);

  return aIndex > bIndex;
};

export const nextPage = (slug: string): string => {
  const currentPageIndex = allPagesSorted.findIndex((s) => s.slug === slug);

  // If current page is the last one or not found, return the same location
  if (
    currentPageIndex === -1 ||
    currentPageIndex === allPagesSorted.length - 1
  ) {
    return slug;
  }

  // Get the next page
  const nextPage = allPagesSorted[currentPageIndex + 1];

  if (nextPage.summary) {
    return nextPage.slug;
  }

  // find the next page that requires a summary
  const nextPageWithSummary = allPagesSorted
    .slice(currentPageIndex + 1)
    .find((s) => s.summary);
  if (nextPageWithSummary) {
    return nextPageWithSummary.slug;
  }
  return slug;
};

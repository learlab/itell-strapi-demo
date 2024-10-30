import { pages } from "#content";

import type { Page } from "#content";

export type PageData = {
  title: string;
  slug: string;
  order: number;
  quiz: Page["quiz"];
  next_slug: string | null;
};

export const getPageData = (slug: string | null): PageData | null => {
  const index = pages.findIndex((s) => s.slug === slug);
  if (index === -1) {
    return null;
  }
  const page = pages[index];

  return {
    title: page.title,
    slug: page.slug,
    next_slug: page.next_slug,
    order: page.order,
    quiz: page.quiz,
  };
};

export const isLastPage = (page: PageData) => {
  return page.next_slug === null;
};

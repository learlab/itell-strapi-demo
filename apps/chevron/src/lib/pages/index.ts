import { Page } from "#content";

// lightweight version of Page
export type PageData = {
  title: string;
  slug: string;
  order: number;
  quiz: Page["quiz"];
  next_slug: string | null;
};

export const isLastPage = (page: { next_slug: string | null }) => {
  return page.next_slug === null;
};

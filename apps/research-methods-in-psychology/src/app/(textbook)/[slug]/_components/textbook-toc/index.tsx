import { getPageStatus } from "@/lib/page-status";
import { tocPages } from "@/lib/pages/pages.server";
import { Page } from "#content";

import { PageControl } from "./page-control";
import { TextbookTocList } from "./toc-list";

type Props = {
  page: Page;
  userFinished: boolean;
  userPageSlug: string | null;
};

export type TocPagesWithStatus = ReturnType<typeof getPagesWithStatus>;

const getPagesWithStatus = (
  userPageSlug: string | null,
  userFinished: boolean
) => {
  return tocPages.map((item) => {
    if (!item.group) {
      return {
        ...item,
        status: getPageStatus({
          userPageSlug,
          pageSlug: item.slug,
          userFinished,
        }),
      };
    }

    return {
      ...item,
      pages: item.pages.map((p) => ({
        ...p,
        status: getPageStatus({
          userPageSlug,
          pageSlug: p.slug,
          userFinished,
        }),
      })),
    };
  });
};

export const TextbookToc = ({ page, userPageSlug, userFinished }: Props) => {
  const pagesWithStatus = getPagesWithStatus(userPageSlug, userFinished);

  return (
    <>
      <TextbookTocList page={page} pages={pagesWithStatus} />
      <PageControl assignment={page.summary} pageSlug={page.slug} />
    </>
  );
};

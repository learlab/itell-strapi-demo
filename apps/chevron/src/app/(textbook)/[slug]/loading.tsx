import { cache } from "react";
import { cookies, headers, type UnsafeUnwrappedHeaders } from "next/headers";
import { notFound } from "next/navigation";
import { Elements } from "@itell/constants";
import { PageTitle } from "@itell/ui/page-title";
import { ScrollArea } from "@itell/ui/scroll-area";
import { Skeleton } from "@itell/ui/skeleton";
import { TextbookToc } from "@textbook/textbook-toc";

import { lucia } from "@/lib/auth/lucia";
import { getPage } from "@/lib/pages/pages.server";
import { PageContentWrapper } from "./page-content-wrapper";
import { TextbookWrapper } from "./textbook-wrapper";

const getUserPageSlug = cache(async () => {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return null;
  }
  const session = await lucia.validateSession(sessionId);
  return session.user?.pageSlug ?? null;
});

const getCurrentPage = () => {
  const headersList = (headers() as unknown as UnsafeUnwrappedHeaders);
  const pathname = headersList.get("x-pathname");
  if (pathname === null) {
    return null;
  }
  const split = pathname.split("/");
  if (split.length < 2) {
    return null;
  }

  const slug = split[1];
  return getPage(slug);
};

export default async function Loading() {
  const page = getCurrentPage();
  if (!page) {
    return notFound();
  }
  const userPageSlug = await getUserPageSlug();
  const arr = Array.from(Array(10).keys());

  return (
    <TextbookWrapper>
      <div id={Elements.TEXTBOOK_NAV}>
        <ScrollArea className="h-full w-full px-6 py-2">
          <TextbookToc
            page={page}
            userPageSlug={userPageSlug}
            userFinished={false}
          />
        </ScrollArea>
      </div>

      <PageContentWrapper>
        <PageTitle className="mb-8">{page.title}</PageTitle>

        {arr.map((i) => (
          <Skeleton className="mb-4 h-28 w-full" key={i} />
        ))}
      </PageContentWrapper>

      <aside id={Elements.PAGE_NAV} aria-label="table of contents">
        <div className="sticky top-20 -mt-10 space-y-4 px-1 py-6">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full ring-2 ring-blue-400" />
            <h3 className="font-semibold">On this page</h3>
          </div>
          <ul className="space-y-2">
            {arr.slice(0, 5).map((i) => (
              <Skeleton className="h-7 w-36" key={i} />
            ))}
          </ul>
        </div>
      </aside>
    </TextbookWrapper>
  );
}

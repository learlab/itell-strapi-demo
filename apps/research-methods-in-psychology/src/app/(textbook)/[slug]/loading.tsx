import { cache } from "react";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { Elements } from "@itell/constants";
import { PageTitle } from "@itell/ui/page-title";
import { ScrollArea } from "@itell/ui/scroll-area";
import { Skeleton } from "@itell/ui/skeleton";
import { TextbookToc } from "@textbook/textbook-toc";

import { lucia } from "@/lib/auth/lucia";
import { PAGE_HEADER_PIN_COOKIE } from "@/lib/constants";
import { getPageStatus } from "@/lib/page-status";
import { allPagesSorted, getPage } from "@/lib/pages/pages.server";
import { PageContentWrapper } from "./page-content-wrapper";
import { PageHeader } from "./page-header";
import { TextbookWrapper } from "./textbook-wrapper";

const getUser = cache(async () => {
  const sessionId =
    (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return null;
  }
  const session = await lucia.validateSession(sessionId);
  return session.user;
});

const getCurrentPage = async () => {
  const headersList = await headers();
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
  const page = await getCurrentPage();
  if (!page) {
    return notFound();
  }
  const user = await getUser();
  const arr = Array.from(Array(10).keys());

  return (
    <TextbookWrapper>
      <div id={Elements.TEXTBOOK_NAV}>
        <ScrollArea className="h-full w-full px-6 py-2">
          <TextbookToc
            page={page}
            userPageSlug={user?.pageSlug ?? null}
            userFinished={false}
          />
        </ScrollArea>
      </div>

      <PageContentWrapper>
        <PageHeader
          page={page}
          pageStatus={getPageStatus({
            pageSlug: page.slug,
            userPageSlug: user?.pageSlug ?? null,
            userFinished: user?.finished ?? false,
          })}
          pin={(await cookies()).get(PAGE_HEADER_PIN_COOKIE)?.value === "true"}
        />
        <div className="col-span-1 col-start-2 mt-4 flex flex-col gap-4">
          <PageTitle>{page.title}</PageTitle>
          {arr.map((i) => (
            <Skeleton className="h-28 w-full" key={i} />
          ))}
        </div>
      </PageContentWrapper>
    </TextbookWrapper>
  );
}

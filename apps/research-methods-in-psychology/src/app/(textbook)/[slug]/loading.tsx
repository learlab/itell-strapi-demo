import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { Elements } from "@itell/constants";
import { PageTitle } from "@itell/ui/page-title";
import { ScrollArea } from "@itell/ui/scroll-area";
import { Skeleton } from "@itell/ui/skeleton";
import { TextbookToc } from "@textbook/textbook-toc";

import { lucia } from "@/lib/auth/lucia";
import { getPage } from "@/lib/pages/pages.server";

export default async function () {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  const result = sessionId ? await lucia.validateSession(sessionId) : null;
  const userPageSlug = result?.user?.pageSlug ?? null;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  let pageSlug: string | null = null;
  if (pathname !== null) {
    const split = pathname.split("/");
    if (split.length === 2) {
      pageSlug = split[1];
    }
  }

  // if this is not found, 404 will be throw at page.tsx
  const page = getPage(pageSlug!);
  if (!page) {
    return notFound();
  }

  const arr = Array.from(Array(10).keys());

  return (
    <main id={Elements.TEXTBOOK_MAIN_WRAPPER}>
      <div id={Elements.TEXTBOOK_NAV}>
        <ScrollArea className="h-full w-full px-6 py-6 lg:py-8">
          <TextbookToc
            page={page}
            userPageSlug={userPageSlug}
            userFinished={false}
          />
        </ScrollArea>
      </div>

      <div id={Elements.TEXTBOOK_MAIN}>
        <PageTitle className="mb-8">{page.title}</PageTitle>

        {arr.map((i) => (
          <Skeleton className="mb-4 h-28 w-full" key={i} />
        ))}
      </div>

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
    </main>
  );
}

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Elements } from "@itell/constants";
import { PageTitle } from "@itell/ui/page-title";
import { ScrollArea } from "@itell/ui/scroll-area";
import { ChatLoader } from "@textbook/chat-loader";
import { EventTracker } from "@textbook/event-tracker";
import { NoteCount } from "@textbook/note/note-count";
import { NoteLoader } from "@textbook/note/note-loader";
import { PageAssignments } from "@textbook/page-assignments";
import { PageContent } from "@textbook/page-content";
import { PageInfo } from "@textbook/page-info";
import { PageStatusModal } from "@textbook/page-status-modal";
import { PageToc } from "@textbook/page-toc";
import { Pager } from "@textbook/pager";
import { QuestionControl } from "@textbook/question/question-control";
import { SelectionPopover } from "@textbook/selection-popover";
import { TextbookToc } from "@textbook/textbook-toc";

import { MobilePopup } from "@/components/mobile-popup";
import { PageProvider } from "@/components/provider/page-provider";
import { getSession } from "@/lib/auth";
import { getUserCondition } from "@/lib/auth/conditions";
import { Condition, isProduction } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { getPage } from "@/lib/pages/pages.server";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = routes.textbook.$parseParams(params);
  const { user } = await getSession();
  const page = getPage(slug);

  if (!page) {
    return notFound();
  }

  const pageSlug = page.slug;

  const userId = user?.id ?? null;
  const userFinished = user?.finished ?? false;
  const userPageSlug = user?.pageSlug ?? null;
  const userCondition = user
    ? getUserCondition(user, pageSlug)
    : Condition.STAIRS;
  const pageStatus = getPageStatus({
    pageSlug,
    userPageSlug,
    userFinished,
  });

  return (
    <PageProvider condition={userCondition} page={page} pageStatus={pageStatus}>
      <main id={Elements.TEXTBOOK_MAIN_WRAPPER}>
        <div id={Elements.TEXTBOOK_NAV}>
          <ScrollArea className="h-full w-full px-6 py-2">
            <TextbookToc
              page={page}
              userPageSlug={userPageSlug}
              userFinished={userFinished}
            />
          </ScrollArea>
        </div>
        <MobilePopup />

        <div id={Elements.TEXTBOOK_MAIN} tabIndex={-1}>
          <PageTitle className="mb-8">{page.title}</PageTitle>
          <PageContent title={page.title} html={page.html} />
          <SelectionPopover user={user} pageSlug={pageSlug} />
          <Pager pageIndex={page.order} userPageSlug={user?.pageSlug ?? null} />
          <p className="mt-4 text-right text-sm text-muted-foreground">
            <span>Last updated at </span>
            <time>{page.last_modified}</time>
          </p>
        </div>

        <aside id={Elements.PAGE_NAV} aria-label="table of contents">
          <div className="sticky top-20 -mt-10">
            <ScrollArea className="pb-10">
              <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
                <PageToc chunks={page.chunks} />
                <div className="mt-8 flex flex-col gap-1">
                  <PageInfo pageSlug={pageSlug} user={user} />
                  <NoteCount />
                </div>
              </div>
            </ScrollArea>
          </div>
        </aside>
      </main>

      <Suspense fallback={<ChatLoader.Skeleton />}>
        <ChatLoader user={user} pageSlug={pageSlug} pageTitle={page.title} />
      </Suspense>

      {user ? <NoteLoader pageSlug={pageSlug} /> : null}
      {user && page.summary ? (
        <PageAssignments
          pageSlug={pageSlug}
          pageStatus={pageStatus}
          user={user}
          condition={userCondition}
        />
      ) : null}

      {isProduction ? (
        <PageStatusModal user={user} pageStatus={pageStatus} />
      ) : null}
      <QuestionControl
        userId={userId}
        pageSlug={pageSlug}
        hasAssignments={page.assignments.length > 0}
        condition={userCondition}
      />
      {user ? <EventTracker pageSlug={pageSlug} /> : null}
    </PageProvider>
  );
}

import { Suspense } from "react";
import Head from "next/head";
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
import { volume } from "#content";

import { MobilePopup } from "@/components/mobile-popup";
import { PageProvider } from "@/components/provider/page-provider";
import { getSession } from "@/lib/auth";
import { getUserCondition } from "@/lib/auth/conditions";
import { Condition, isProduction } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { getPage } from "@/lib/pages/pages.server";
import { PageContentWrapper } from "./page-content-wrapper";
import { TextbookWrapper } from "./textbook-wrapper";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
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
      {volume.latex ? (
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
            integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC"
            crossOrigin="anonymous"
          />
        </Head>
      ) : null}
      <TextbookWrapper>
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

        <PageContentWrapper>
          <PageTitle className="mb-8">{page.title}</PageTitle>
          <PageContent title={page.title} html={page.html} />
          <SelectionPopover user={user} pageSlug={pageSlug} />
          <Pager pageIndex={page.order} userPageSlug={user?.pageSlug ?? null} />
          <p className="mt-4 text-right text-sm text-muted-foreground">
            <span>Last updated at </span>
            <time>{page.last_modified}</time>
          </p>
        </PageContentWrapper>
      </TextbookWrapper>

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

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Elements } from "@itell/constants";
import { PageTitle } from "@itell/ui/page-title";
import { ScrollArea } from "@itell/ui/scroll-area";
import { ChatLoader } from "@textbook/chat-loader";
import { EventTracker } from "@textbook/event-tracker";
import { NoteLoader } from "@textbook/note/note-loader";
import { PageAssignments } from "@textbook/page-assignments";
import { PageContent } from "@textbook/page-content";
import { PageStatusModal } from "@textbook/page-status-modal";
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
import { PageContentWrapper } from "./page-content-wrapper";
import { PageHeader } from "./page-header";
import { TextbookWrapper } from "./textbook-wrapper";

const ResourceLoader = dynamic(() =>
  import("./resource-loader").then((mod) => mod.ResourceLoader)
);

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
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
      <MobilePopup />
      <ResourceLoader />
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

        <PageContentWrapper>
          <PageHeader page={page} user={user} />
          <div className="col-span-1 col-start-2">
            <PageTitle className="mb-8">{page.title}</PageTitle>
            <PageContent title={page.title} html={page.html} />
            <SelectionPopover user={user} pageSlug={pageSlug} />
            <Pager
              pageIndex={page.order}
              userPageSlug={user?.pageSlug ?? null}
            />
            <p className="mt-4 text-right text-sm text-muted-foreground">
              <span>Last updated at </span>
              <time>{page.last_modified}</time>
            </p>
          </div>
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

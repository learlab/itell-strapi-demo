import { PageProvider } from "@/components/provider/page-provider";
import { getSession } from "@/lib/auth";
import { Condition, isProduction } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { allPagesSorted } from "@/lib/pages";
import { getRandomPageQuestions } from "@/lib/question";
import "@/styles/code.css";
import { Elements } from "@itell/constants";
import { ScrollArea } from "@itell/ui/client";
import { Info, PageTitle } from "@itell/ui/server";
import { ChapterToc } from "@textbook/chapter-toc";
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
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ({ params }: { params: { slug: string } }) {
	const { slug } = routes.textbook.$parseParams(params);
	const { user } = await getSession();
	const pageIndex = allPagesSorted.findIndex((page) => {
		return page.page_slug === slug;
	});

	if (pageIndex === -1) {
		return notFound();
	}

	const page = allPagesSorted[pageIndex];
	const pageSlug = page.page_slug;

	const questions = await getRandomPageQuestions(pageSlug);
	const userRole = user?.role || "user";
	const userId = user?.id || null;
	const userFinished = user?.finished || false;
	const userPageSlug = user?.pageSlug || null;
	const userCondition = user?.condition || Condition.STAIRS;
	const pageStatus = getPageStatus({
		pageSlug,
		userPageSlug,
		userFinished,
	});

	return (
		<PageProvider
			pageSlug={pageSlug}
			chunks={page.chunks}
			questions={questions}
			pageStatus={pageStatus}
		>
			<main id={Elements.TEXTBOOK_MAIN_WRAPPER}>
				<div id={Elements.TEXTBOOK_NAV}>
					<ScrollArea className="h-full w-full px-6 py-6 lg:py-8">
						<ChapterToc
							currentPage={page}
							userPageSlug={userPageSlug}
							userFinished={userFinished}
							userRole={userRole}
							condition={userCondition}
						/>
					</ScrollArea>
				</div>

				<div id={Elements.TEXTBOOK_MAIN} tabIndex={-1}>
					<PageTitle>{page.title}</PageTitle>
					<PageContent title={page.title} code={page.code} />
					<SelectionPopover user={user} pageSlug={pageSlug} />
					<Pager pageIndex={pageIndex} userPageSlug={user?.pageSlug || null} />
					<p className="text-right text-sm text-muted-foreground mt-4">
						<span>Last updated at </span>
						<time>{page.last_modified}</time>
					</p>
				</div>

				<aside id={Elements.PAGE_NAV} aria-label="table of contents">
					<div className="sticky top-20 -mt-10">
						<ScrollArea className="pb-10">
							<div className="sticky top-16 -mt-10 h-[70vh] py-12">
								<PageToc headings={page.headings} />
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

			{user && <NoteLoader pageSlug={pageSlug} />}
			{page.summary && user && (
				<PageAssignments
					pageSlug={pageSlug}
					pageStatus={pageStatus}
					user={user}
					condition={userCondition}
				/>
			)}

			{isProduction && <PageStatusModal user={user} pageStatus={pageStatus} />}
			<QuestionControl
				userId={userId}
				pageSlug={pageSlug}
				condition={userCondition}
			/>
			{user && <EventTracker pageSlug={pageSlug} chunks={page.chunks} />}
		</PageProvider>
	);
}

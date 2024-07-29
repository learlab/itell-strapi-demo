import { PageAssignments } from "@/app/(textbook)/[slug]/_components/page-assignments";
import { PageProvider } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { getSession } from "@/lib/auth";
import { Condition, Elements } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { allPagesSorted } from "@/lib/pages";
import { getRandomPageQuestions } from "@/lib/question";
import { ScrollArea } from "@itell/ui/client";
import { ChapterToc } from "@textbook/chapter-toc";
import { ChatLoader } from "@textbook/chat-loader";
import { EventTracker } from "@textbook/event-tracker";
import { NotePopover } from "@textbook/note-popover";
import { NoteCount } from "@textbook/note/note-count";
import { NoteLoader } from "@textbook/note/note-loader";
import { PageContent } from "@textbook/page-content";
import { PageInfo } from "@textbook/page-info";
import { PageStatusModal } from "@textbook/page-status-modal";
import { PageTitle } from "@textbook/page-title";
import { PageToc } from "@textbook/page-toc";
import { Pager } from "@textbook/pager";
import { QuestionControl } from "@textbook/question/question-control";
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

	const chunks = getPageChunks(page.body.raw);

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
			pageTitle={page.title}
			chunks={chunks}
			questions={questions}
			pageStatus={pageStatus}
		>
			<main
				id={Elements.TEXTBOOK_MAIN_WRAPPER}
				className="grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_3.5fr_250px] gap-6 flex-1"
			>
				<div className="chapter-sidebar fixed top-16 h-[calc(100vh-3.5rem)] lg:sticky lg:block hidden z-30 border-r-2">
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

				<div
					id={Elements.TEXTBOOK_MAIN}
					className="relative p-4 lg:p-8 lg:pb-12"
					aria-live="polite"
				>
					<PageTitle>{page.title}</PageTitle>
					<PageContent title={page.title} code={page.body.code} />
					<NotePopover pageSlug={pageSlug} userId={userId} />
					<Pager pageIndex={pageIndex} />
				</div>

				<aside
					aria-label="table of contents"
					className="toc-sidebar hidden md:block relative"
				>
					<div className="sticky top-20 -mt-10 pt-4">
						<ScrollArea className="pb-10">
							<div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12 px-4">
								<PageToc headings={page.headings} />
								<div className="mt-8 flex flex-col gap-1">
									<PageInfo pageSlug={pageSlug} />
									<NoteCount />
								</div>
							</div>
						</ScrollArea>
					</div>
					{user && (
						<Suspense fallback={<Spinner className="mt-8" />}>
							<NoteLoader pageSlug={pageSlug} />
						</Suspense>
					)}
				</aside>
			</main>

			{page.summary && user && (
				<PageAssignments
					pageSlug={pageSlug}
					pageStatus={pageStatus}
					user={user}
					condition={userCondition}
				/>
			)}

			<PageStatusModal user={user} pageStatus={pageStatus} />
			<QuestionControl
				userId={userId}
				pageSlug={pageSlug}
				condition={userCondition}
			/>
			{user && <EventTracker pageSlug={pageSlug} chunks={chunks} />}
			<Suspense fallback={<ChatLoader.Skeleton />}>
				<ChatLoader pageSlug={pageSlug} condition={userCondition} />
			</Suspense>
		</PageProvider>
	);
}
const getPageChunks = (raw: string) => {
	const contentChunkRegex =
		/<section(?=\s)(?=[\s\S]*?\bclassName="content-chunk")(?=[\s\S]*?\bdata-subsection-id="([^"]+)")[\s\S]*?>/g;
	const chunks: string[] = [];

	const matches = raw.matchAll(contentChunkRegex);

	for (const match of matches) {
		if (match[1]) {
			chunks.push(match[1]);
		}
	}

	return chunks;
};
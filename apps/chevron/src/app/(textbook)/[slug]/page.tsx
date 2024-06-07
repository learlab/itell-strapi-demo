import { ChapterToc } from "@/components/chapter-toc";
import { ChatLoader } from "@/components/chat/chat-loader";
import { ConstructedResponseControl } from "@/components/constructed-response/constructed-response-control";
import { NoteCountLoader } from "@/components/note/note-count-loader";
import { NoteLoader } from "@/components/note/note-loader";
import { NoteToolbar } from "@/components/note/note-toolbar";
import { PageStatus } from "@/components/page-status/page-status";
import { PageStatusModal } from "@/components/page-status/page-status-modal";
import { PageTitle } from "@/components/page-title";
import { PageToc } from "@/components/page-toc";
import { PageContent } from "@/components/page/page-content";
import { Pager } from "@/components/page/pager";
import { PageProvider } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { PageSummary } from "@/components/summary/page-summary";
import { EventTracker } from "@/components/telemetry/event-tracker";
import { getSession } from "@/lib/auth";
import { getPageChunks } from "@/lib/chunks";
import { Condition } from "@/lib/control/condition";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { allPagesSorted } from "@/lib/pages";
import { getRandomPageQuestions } from "@/lib/question";
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
	const chunks = getPageChunks(page);

	const selectedQuestions = await getRandomPageQuestions(pageSlug);
	const isLastChunkWithQuestion = selectedQuestions.has(chunks.at(-1) || "");

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
			chunks={chunks}
			pageStatus={pageStatus}
			isLastChunkWithQuestion={isLastChunkWithQuestion}
		>
			<div
				id="textbook-page-wrapper"
				className="flex flex-row max-w-[1440px] mx-auto gap-6 px-2"
			>
				<aside
					className="chapter-sidebar hidden md:block sticky top-20 h-fit z-20 basis-0 animate-out ease-in-out duration-200"
					style={{ flexGrow: 1 }}
				>
					<ChapterToc
						currentPage={page}
						userId={userId}
						userPageSlug={userPageSlug}
						userFinished={userFinished}
						userRole={userRole}
						condition={userCondition}
					/>
				</aside>

				<section
					id="page-content-wrapper"
					className="relative lg:max-w-4xl md:max-w-3xl max-w-2xl"
					style={{ flexGrow: 4 }}
				>
					<PageTitle>{page.title}</PageTitle>
					<PageContent code={page.body.code} />
					<NoteToolbar pageSlug={pageSlug} userId={userId} />
					<Pager pageIndex={pageIndex} />
				</section>

				<aside
					className="toc-sidebar hidden sm:block relative animate-out ease-in-out duration-200"
					style={{ flexGrow: 1 }}
				>
					<div className="sticky top-20">
						<PageToc headings={page.headings} chunks={getPageChunks(page)} />
						<div className="mt-8 flex flex-col gap-1">
							<PageStatus pageSlug={pageSlug} />
							<Suspense fallback={<NoteCountLoader.Skeleton />}>
								<NoteCountLoader pageSlug={pageSlug} />
							</Suspense>
						</div>
					</div>
					<Suspense
						fallback={
							<p className="text-sm text-muted-foreground mt-8">
								<Spinner className="inline mr-2" />
								Loading notes
							</p>
						}
					>
						<NoteLoader userId={userId} pageSlug={pageSlug} />
					</Suspense>
				</aside>
			</div>

			{page.summary && user && (
				<footer>
					<PageSummary
						pageSlug={pageSlug}
						pageStatus={pageStatus}
						user={user}
						condition={userCondition}
					/>
				</footer>
			)}

			<PageStatusModal user={user} pageStatus={pageStatus} />
			<ConstructedResponseControl
				selectedQuestions={selectedQuestions}
				pageSlug={pageSlug}
				pageStatus={pageStatus}
				condition={userCondition}
			/>
			<EventTracker userId={userId} pageSlug={pageSlug} chunks={chunks} />
			<Suspense fallback={<ChatLoader.Skeleton />}>
				<ChatLoader pageSlug={pageSlug} condition={userCondition} />
			</Suspense>
		</PageProvider>
	);
}

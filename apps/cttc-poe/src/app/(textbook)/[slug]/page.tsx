import { ChapterToc } from "@/components/chapter-toc";
import { ChatLoader } from "@/components/chat/chat-loader";
import { Pager } from "@/components/client-components";
import { ConstructedResponseControl } from "@/components/constructed-response/constructed-response-control";
import { NoteCountLoader } from "@/components/note/note-count-loader";
import { NoteLoader } from "@/components/note/note-loader";
import { NoteToolbar } from "@/components/note/note-toolbar";
import { PageStatus } from "@/components/page-status/page-status";
import { PageStatusModal } from "@/components/page-status/page-status-modal";
import { PageTitle } from "@/components/page-title";
import { PageToc } from "@/components/page-toc";
import { PageContent } from "@/components/page/page-content";
import { PageProvider } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { PageSummary } from "@/components/summary/page-summary";
import { EventTracker } from "@/components/telemetry/event-tracker";
import { getSession } from "@/lib/auth";
import { getPageChunks } from "@/lib/chunks";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { getPagerLinks } from "@/lib/pager";
import { allPagesSorted } from "@/lib/pages";
import { getRandomPageQuestions } from "@/lib/question";
import { EyeIcon, LockIcon, UnlockIcon } from "lucide-react";
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

	const pagerLinks = getPagerLinks({
		pageIndex,
		userPageSlug: user?.pageSlug || null,
	});

	const chunks = getPageChunks(page);

	const selectedQuestions = await getRandomPageQuestions(pageSlug);
	const isLastChunkWithQuestion = selectedQuestions.has(chunks.at(-1) || "");
	const pageStatus = getPageStatus({
		pageSlug,
		userPageSlug: user?.pageSlug || null,
		userFinished: user?.finished || false,
	});
	const { isPageLatest, isPageUnlocked } = pageStatus;

	return (
		<PageProvider
			pageSlug={pageSlug}
			chunks={chunks}
			pageStatus={pageStatus}
			isLastChunkWithQuestion={isLastChunkWithQuestion}
		>
			<div className="flex flex-row max-w-[1440px] mx-auto gap-6 px-2">
				<aside
					className="chapter-sidebar sticky top-20 h-fit z-20 basis-0 animate-out ease-in-out duration-200"
					style={{ flexGrow: 1 }}
				>
					<ChapterToc
						currentPage={page}
						userPageSlug={user?.pageSlug || null}
						userFinished={user?.finished || false}
						userRole={user?.role || "user"}
					/>
				</aside>

				<section
					className="page-content relative max-w-[850px]"
					style={{ flexGrow: 4 }}
				>
					<PageTitle>
						{page.title}
						{isPageLatest ? (
							<EyeIcon />
						) : isPageUnlocked ? (
							<UnlockIcon />
						) : (
							<LockIcon />
						)}
					</PageTitle>
					<PageContent code={page.body.code} />
					<NoteToolbar pageSlug={pageSlug} user={user} />
					<Pager prev={pagerLinks.prev} next={pagerLinks.next} />
				</section>

				<aside
					className="toc-sidebar relative animate-out ease-in-out duration-200"
					style={{ flexGrow: 1 }}
				>
					<div className="sticky top-20">
						<PageToc headings={page.headings} chunks={getPageChunks(page)} />
						<div className="mt-8 flex flex-col gap-1">
							<PageStatus status={pageStatus} />
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
						<NoteLoader pageSlug={pageSlug} />
					</Suspense>
				</aside>
			</div>

			{page.summary && (
				<footer>
					<PageSummary pageSlug={pageSlug} pageStatus={pageStatus} />
				</footer>
			)}

			<PageStatusModal user={user} pageStatus={pageStatus} />
			<ConstructedResponseControl
				selectedQuestions={selectedQuestions}
				pageSlug={pageSlug}
				pageStatus={pageStatus}
			/>
			<EventTracker user={user} pageSlug={pageSlug} chunks={chunks} />
			<Suspense fallback={<ChatLoader.Skeleton />}>
				<ChatLoader pageSlug={pageSlug} />
			</Suspense>
		</PageProvider>
	);
}

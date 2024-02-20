import { Pager } from "@/components/client-components";
import { ModuleToc } from "@/components/module-toc";
import { NoteCount } from "@/components/note/note-count";
import { NoteList } from "@/components/note/note-list";
import { NoteToolbar } from "@/components/note/note-toolbar";
import { PageStatus } from "@/components/page-status/page-status";
import { PageStatusModal } from "@/components/page-status/page-status-modal";
import { PageTitle } from "@/components/page-title";
import { PageToc } from "@/components/page-toc";
import { PageContent } from "@/components/page/page-content";
import { PageProvider } from "@/components/provider/page-provider";
import { QuestionControl } from "@/components/question/question-control";
import { Spinner } from "@/components/spinner";
import { PageSummary } from "@/components/summary/page-summary";
import { EventTracker } from "@/components/telemetry/event-tracker";
import { getCurrentUser } from "@/lib/auth";
import { getPageChunks } from "@/lib/chunks";
import { isPageWithFeedback } from "@/lib/feedback";
import { getPageStatus } from "@/lib/page-status";
import { getPagerLinks } from "@/lib/pager";
import { allPagesSorted } from "@/lib/pages";
import { getRandomPageQuestions } from "@/lib/question";
import { getUser } from "@/lib/user";
import { EyeIcon, LockIcon, UnlockIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ({ params }: { params: { slug: string } }) {
	const sessionUser = await getCurrentUser();
	const user = sessionUser ? await getUser(sessionUser.id) : null;
	const pageIndex = allPagesSorted.findIndex((section) => {
		return section.page_slug === params.slug;
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

	const isFeedbackEnabled = sessionUser
		? isPageWithFeedback(sessionUser, page)
		: true;

	const chunks = getPageChunks(page);

	const selectedQuestions = await getRandomPageQuestions(pageSlug);
	const isLastChunkWithQuestion = selectedQuestions.has(
		chunks[chunks.length - 1],
	);
	const pageStatus = getPageStatus(pageSlug, user?.pageSlug);
	const { isPageLatest, isPageUnlocked } = pageStatus;

	return (
		<PageProvider
			pageSlug={pageSlug}
			chunks={chunks}
			pageStatus={pageStatus}
			isLastChunkWithQuestion={isLastChunkWithQuestion}
		>
			<div className="flex flex-row justify-end max-w-[1440px] mx-auto gap-6 px-2">
				<aside
					className="module-sidebar sticky top-20 h-fit z-20 basis-0 animate-out ease-in-out duration-200"
					style={{ flexGrow: 1 }}
				>
					<ModuleToc page={page} user={user} />
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
					<NoteToolbar pageSlug={pageSlug} />
					<Pager prev={pagerLinks.prev} next={pagerLinks.next} />
				</section>

				<aside
					className="toc-sidebar relative animate-out ease-in-out duration-200"
					style={{ flexGrow: 1 }}
				>
					<div className="sticky top-20">
						<PageToc headings={page.headings} />
						<div className="mt-8 flex flex-col gap-1">
							<PageStatus status={pageStatus} />
							{user && <NoteCount user={user} pageSlug={pageSlug} />}
						</div>
					</div>
					<Suspense
						fallback={
							<p className="text-sm text-muted-foreground mt-8">
								<Spinner className="inline mr-2" />
								loading notes
							</p>
						}
					>
						<NoteList pageSlug={pageSlug} />
					</Suspense>
				</aside>
			</div>

			{page.summary && (
				<footer>
					<PageSummary
						pageSlug={pageSlug}
						isFeedbackEnabled={isFeedbackEnabled}
					/>
				</footer>
			)}

			<PageStatusModal user={user} pageStatus={pageStatus} />
			<QuestionControl
				selectedQuestions={selectedQuestions}
				pageSlug={pageSlug}
				isFeedbackEnabled={isFeedbackEnabled}
			/>
			{user && <EventTracker pageSlug={pageSlug} />}
		</PageProvider>
	);
}

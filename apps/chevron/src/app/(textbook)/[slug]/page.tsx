import { PageProvider } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { getSession } from "@/lib/auth";
import { getPageChunks } from "@/lib/chunks";
import { Condition } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { allPagesSorted } from "@/lib/pages";
import { getRandomPageQuestions } from "@/lib/question";
import { ScrollArea } from "@itell/ui/client";
import { Info } from "@itell/ui/server";
import { ChapterToc } from "@textbook/chapter-toc";
import { ChatLoader } from "@textbook/chat-loader";
import { EventTracker } from "@textbook/event-tracker";
import { NotePopover } from "@textbook/note-popover";
import { NoteCount } from "@textbook/note/note-count";
import { NoteLoader } from "@textbook/note/note-loader";
import { PageContent } from "@textbook/page-content";
import { PageInfo } from "@textbook/page-info";
import { PageStatusModal } from "@textbook/page-status-modal";
import { PageSummary } from "@textbook/page-summary";
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
			<div
				id="textbook-page-wrapper"
				className="grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_3.5fr_250px] gap-6"
			>
				<aside className="chapter-sidebar fixed top-16 h-[calc(100vh-3.5rem)] lg:sticky lg:block hidden z-30 border-r-2">
					<ScrollArea className="h-full w-full px-6 py-6 lg:py-8">
						<ChapterToc
							currentPage={page}
							userPageSlug={userPageSlug}
							userFinished={userFinished}
							userRole={userRole}
							condition={userCondition}
						/>
					</ScrollArea>
				</aside>

				<section
					id="page-content-wrapper"
					className="relative p-4 lg:p-8 lg:pb-12"
				>
					<PageTitle>{page.title}</PageTitle>
					{user?.condition === Condition.SIMPLE &&
						page._raw.sourceFileName === "index.mdx" && <ReadingStrategy />}
					<PageContent code={page.body.code} />
					<NotePopover pageSlug={pageSlug} userId={userId} />
					<Pager pageIndex={pageIndex} />
				</section>

				<aside className="toc-sidebar hidden md:block relative">
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
						<Suspense
							fallback={
								<p className="text-sm text-muted-foreground mt-8">
									<Spinner className="inline mr-2" />
								</p>
							}
						>
							<NoteLoader pageSlug={pageSlug} />
						</Suspense>
					)}
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
			<QuestionControl pageSlug={pageSlug} condition={userCondition} />
			{user && <EventTracker pageSlug={pageSlug} chunks={chunks} />}
			<Suspense fallback={<ChatLoader.Skeleton />}>
				<ChatLoader pageSlug={pageSlug} condition={userCondition} />
			</Suspense>
		</PageProvider>
	);
}

const ReadingStrategy = () => {
	return (
		<Info className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
			<p>
				There are a number of strategies that can be used when reading to better
				understand a text, including self-explanation. Self-explanation helps
				you monitor your reading and understanding. As you read this chapter,
				please use the following strategies to explain the text to yourself:
			</p>
			<ul>
				<li>Paraphrasing - Restating the text in your own words</li>
				<li>
					Elaboration - Comparing what is in the text to related knowledge
				</li>
				<li>Logic - Using common sense to make inferences</li>
				<li>Predicting - Thinking about what may come next in the text</li>
				<li>Bridging - Linking ideas between different parts of the text</li>
			</ul>
			<p>
				For example, after reading the sentence "In eukaryotic cells, or cells
				with a nucleus, the stages of the cell cycle are divided into two major
				phases: interphase and the mitotic (M) phase.", you could self-explain
				to yourself and make a prediction as follows "Okay, so those are the two
				phases. Now they're going to provide more details about the different
				phases."
			</p>
			<p>
				Using these strategies while reading have been shown to improve reading
				comprehension and overall learning.
			</p>
		</Info>
	);
};

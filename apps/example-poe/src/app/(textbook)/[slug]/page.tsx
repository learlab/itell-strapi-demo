import Balancer from "react-wrap-balancer";
import { notFound } from "next/navigation";
import { getPagerLinksForChapter } from "@/lib/pager";
import { NoteList } from "@/components/note/note-list";
import { NoteToolbar } from "@/components/note/note-toolbar";
import { Fragment, Suspense } from "react";
import { allChaptersSorted } from "@/lib/chapters";
import { Pager } from "@/components/client-components";
import { PageToc } from "@/components/page-toc";
import { PageContent } from "@/components/section/page-content";
import { Spinner } from "@/components/spinner";
import { getPageQuestions } from "@/lib/question";
import { QuestionControl } from "@/components/question/question-control";
import { getCurrentUser } from "@/lib/auth";
import { getUser } from "@/lib/user";
import { EyeIcon, LockIcon, UnlockIcon } from "lucide-react";
import { PageStatusModal } from "@/components/page-status/page-status-modal";
import { PageTitle } from "@/components/page-title";
import { NoteCount } from "@/components/note/note-count";
import { PageStatus } from "@/components/page-status/page-status";
import { EventTracker } from "@/components/telemetry/event-tracker";
import { isProduction } from "@/lib/constants";
import { readClassSettings } from "@/lib/class";
import { isChapterWithFeedback } from "@/lib/chapter";

export const dynamic = "force-dynamic";

export default async function ({ params }: { params: { slug: string } }) {
	const url = params.slug;
	const chapterIndex = allChaptersSorted.findIndex((section) => {
		return section.url === url;
	});

	if (chapterIndex === -1) {
		return notFound();
	}
	const chapter = allChaptersSorted[chapterIndex];
	const pagerLinks = getPagerLinksForChapter(chapterIndex);

	const sessionUser = await getCurrentUser();
	const user = sessionUser ? await getUser(sessionUser.id) : null;

	const isFeedbackEnabled = isChapterWithFeedback(chapter.chapter);
	// get subsections
	let questions: Awaited<ReturnType<typeof getPageQuestions>> = [];
	const pageId = `${String(chapter.chapter).padStart(2, "0")}`;
	// Subsections to be passed onto page
	const selectedQuestions = new Map<
		number,
		{ question: string; answer: string }
	>();
	if (chapter.qa) {
		const chooseQuestion = (question: (typeof questions)[0]) => {
			let targetQuestion = question.question;
			// band-aid solution for YouTube videos until we implement content-types via Strapi
			if (question.slug.includes("learn-with-videos")) {
				targetQuestion = `(Watch the YouTube video above to answer this question) ${targetQuestion}`;
			}

			if (targetQuestion && question.answer) {
				selectedQuestions.set(question.subsection, {
					question: targetQuestion,
					answer: question.answer,
				});
			}
		};

		questions = await getPageQuestions(pageId);

		for (let index = 0; index < questions.length - 1; index++) {
			// Each subsection has a 1/3 chance of spawning a question
			if (Math.random() < 1 / 3) {
				chooseQuestion(questions[index]);
			}
		}

		// Each page will have at least one question
		if (selectedQuestions.size === 0) {
			const randChunk = Math.floor(Math.random() * (questions.length - 1));
			chooseQuestion(questions[randChunk]);
		}
	}

	const isPageUnlockedWithoutUser = chapter.chapter < 2;
	const isUserLatestPage = user ? user?.chapter === chapter.chapter : false;
	// can view page, with no blurred chunks
	const isPageUnlocked = user
		? user.chapter > chapter.chapter
		: isPageUnlockedWithoutUser;
	// can view page, but with blurred chunks
	const isPageMasked = user ? user.chapter <= chapter.chapter : true;

	return (
		<Fragment>
			<section className="relative col-span-12 md:col-span-10 lg:col-span-8">
				<PageTitle>
					<Balancer>{chapter.title}</Balancer>
					{isUserLatestPage ? (
						<EyeIcon />
					) : isPageUnlocked ? (
						<UnlockIcon />
					) : (
						<LockIcon />
					)}
				</PageTitle>

				<PageContent code={chapter.body.code} />
				<NoteToolbar chapter={chapter.chapter} />
				<Pager prev={pagerLinks.prev} next={pagerLinks.next} />
			</section>

			<aside className="toc-sidebar col-span-2 relative">
				<div className="sticky top-20">
					<PageToc headings={chapter.headings} />
					<div className="mt-8 flex flex-col gap-2">
						<PageStatus
							status={
								isUserLatestPage
									? "current"
									: isPageUnlocked
									  ? "unlocked"
									  : "locked"
							}
						/>
						{user && <NoteCount user={user} chapter={chapter.chapter} />}
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
					<NoteList chapter={chapter.chapter} />
				</Suspense>
			</aside>

			<PageStatusModal chapter={chapter.chapter} user={user} />

			{chapter.qa && (
				<QuestionControl
					isFeedbackEnabled={isFeedbackEnabled}
					isPageMasked={isPageMasked}
					selectedQuestions={selectedQuestions}
					chapter={chapter.chapter}
				/>
			)}

			{user && isProduction && <EventTracker user={user} />}
		</Fragment>
	);
}

import Balancer from "react-wrap-balancer";
import { PageSummary } from "@/components/summary/page-summary";
import { notFound } from "next/navigation";
import { getPagerLinksForChapter } from "@/lib/pager";
import { NoteList } from "@/components/note/note-list";
import { NoteToolbar } from "@/components/note/note-toolbar";
import { ArrowUpIcon, PencilIcon } from "lucide-react";
import { Fragment, Suspense } from "react";
import { allChaptersSorted } from "@/lib/chapters";
import { Button, Pager } from "@/components/client-components";
import { TocSidebar } from "@/components/toc-sidebar";
import { ChapterSidebar } from "@/components/chapter-sidebar";
import { PageContent } from "@/components/page-content";
import Spinner from "@/components/spinner";
import { PageVisibilityModal } from "@/components/page-visibility-modal";
import { EventTracker } from "@/components/telemetry/event-tracker";
import { getPageQuestions } from "@/lib/question";
import { QuestionControl } from "@/components/question/question-control";

export const dynamic = "force-dynamic";

export const generateStaticParams = async () => {
	return allChaptersSorted.map((chapter) => {
		return {
			slug: chapter.url,
		};
	});
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
	const chapter = allChaptersSorted.find(
		(chapter) => chapter.url === params.slug,
	);
	if (chapter) {
		return {
			title: chapter.title,
			description: chapter.body.raw.slice(0, 80),
		};
	}
};

const AnchorLink = ({
	text,
	href,
	icon,
}: { text: string; href: string; icon: React.ReactNode }) => (
	<a href={href}>
		<Button
			size="sm"
			variant="ghost"
			className="flex items-center gap-1 mb-0 py-1"
		>
			{icon}
			<span>{text}</span>
		</Button>
	</a>
);

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

	const requireSummary = chapter.summary;
	const isDev = process.env.NODE_ENV === "development";

	const pageId = `${String(chapter.chapter).padStart(2, "0")}`;

	// get subsections
	let questions: Awaited<ReturnType<typeof getPageQuestions>> = [];
	// Subsections to be passed onto page
	const selectedQuestions = new Map<
		number,
		{ question: string; answer: string }
	>();
	if (chapter.qa) {
		const chooseQuestion = (question: typeof questions[0]) => {
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

	return (
		<Fragment>
			<div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-6 px-2">
				<PageVisibilityModal />
				{!isDev && <EventTracker />}

				<aside className="module-sidebar  md:col-span-2">
					<div className="sticky top-20">
						<ChapterSidebar
							currentChapter={chapter.chapter}
							chapters={allChaptersSorted}
						/>
						<div className="mt-12 flex flex-col gap-2">
							{requireSummary && (
								<AnchorLink
									icon={<PencilIcon className="w-4 h-4" />}
									text="Write a Summary"
									href="#page-summary"
								/>
							)}
							<AnchorLink
								icon={<ArrowUpIcon className="w-4 h-4" />}
								text="Back to Top"
								href="#page-title"
							/>
						</div>
					</div>
				</aside>

				<section className="relative col-span-12 md:col-span-10 lg:col-span-8">
					<h1
						className="text-3xl font-semibold mb-4 text-center"
						id="page-title"
					>
						<Balancer>{chapter.title}</Balancer>
					</h1>

					<PageContent code={chapter.body.code} />
					<NoteToolbar chapter={chapter.chapter} />
					<Pager prev={pagerLinks.prev} next={pagerLinks.next} />
				</section>

				{chapter.qa && (
					<QuestionControl
						selectedQuestions={selectedQuestions}
						chapter={chapter.chapter}
					/>
				)}

				<aside className="toc-sidebar col-span-2 relative">
					<div className="sticky top-20">
						<TocSidebar headings={chapter.headings} />
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
			</div>

			{requireSummary && <PageSummary chapter={chapter.chapter} />}
		</Fragment>
	);
}

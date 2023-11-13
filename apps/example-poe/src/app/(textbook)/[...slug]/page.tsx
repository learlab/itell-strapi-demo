import Balancer from "react-wrap-balancer";
import { PageSummary } from "@/components/summary/page-summary";
import { notFound } from "next/navigation";
import { SectionLocation } from "@/types/location";
import getChapters from "@/lib/sidebar";
import { PageVisibilityModal } from "@/components/page-visibility-modal";
import { getPagerLinksForSection } from "@/lib/pager";
import NoteList from "@/components/note/note-list";
import Highlighter from "@/components/note/note-toolbar";
import { ArrowUpIcon, PencilIcon } from "lucide-react";
import { Fragment, Suspense } from "react";
import { allSectionsSorted } from "@/lib/sections";
import { Button, Pager } from "@/components/client-components";
import { ModuleSidebar } from "@/components/module-sidebar";
import { TocSidebar } from "@/components/toc-sidebar";
import { Section } from "contentlayer/generated";
import Spinner from "@/components/spinner";
import { EventTracker } from "@/components/telemetry/event-tracker";
import { PageContent } from "@/components/section/page-content";
import { QuestionControl } from "@/components/question/question-control";
import { getCurrentUser } from "@/lib/auth";
import { env } from "@/env.mjs";
import { getPageQuestions } from "@/lib/question";

export const generateStaticParams = async () => {
	return allSectionsSorted.map((section) => {
		return {
			slug: section.url.split("/"),
		};
	});
};

export const generateMetadata = ({
	params,
}: { params: { slug: string[] } }) => {
	const section = allSectionsSorted.find(
		(section) => section.url === params.slug.join("/"),
	);
	if (section) {
		return {
			title: section.title,
			description: section.body.raw.slice(0, 100),
		};
	}
};

const AnchorLink = ({
	text,
	href,
	icon,
}: { text: string; href: string; icon: React.ReactNode }) => {
	return (
		<a href={href}>
			<Button
				size="sm"
				variant="ghost"
				className="flex items-center gap-1 mb-0 py-1"
			>
				{icon}
				{text}
			</Button>
		</a>
	);
};

export default async function ({ params }: { params: { slug: string[] } }) {
	const user = await getCurrentUser();
	const whitelist = JSON.parse(env.SUMMARY_WHITELIST || "[]") as string[];
	const showVisibilityModal = !whitelist.includes(user?.email || "");
	const path = params.slug.join("/");
	const sectionIndex = allSectionsSorted.findIndex((section) => {
		return section.url === path;
	});

	if (sectionIndex === -1) {
		return notFound();
	}

	const section = allSectionsSorted[sectionIndex] as Section;
	const enableQA = section.qa;
	const currentLocation = section.location as SectionLocation;
	const pagerLinks = getPagerLinksForSection(sectionIndex);
	const chapters = await getChapters({
		module: currentLocation.module,
		allSections: allSectionsSorted,
	});

	const hasSummary = section.summary;
	const isDev = process.env.NODE_ENV === "development";

	// Would be easier if we change chapter and section in Supabase to strings that match the
	// formatting of subsection indices (i.e., strings with leading zeroes)
	const pageId = `${currentLocation.chapter < 10 ? "0" : ""}${
		currentLocation.chapter
	}-${currentLocation.section < 10 ? "0" : ""}${currentLocation.section}`;

	// get subsections
	let questions: Awaited<ReturnType<typeof getPageQuestions>> = [];
	// Subsections to be passed onto page
	const selectedQuestions = new Map<
		number,
		{ question: string; answer: string }
	>();
	if (enableQA) {
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
			<div className="grid grid-cols-12 gap-6 px-2 relative">
				{showVisibilityModal && <PageVisibilityModal />}
				{!isDev && <EventTracker />}

				<aside className="module-sidebar col-span-2 sticky top-20 h-fit">
					<ModuleSidebar
						chapters={chapters}
						currentLocation={currentLocation}
					/>
					<div className="mt-12 flex flex-col">
						{hasSummary && (
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
				</aside>

				<section className="page-content relative col-span-8">
					<h1
						className="text-3xl font-semibold mb-4 text-center"
						id="page-title"
					>
						<Balancer>{section.title}</Balancer>
					</h1>
					{enableQA && (
						<QuestionControl
							selectedQuestions={selectedQuestions}
							location={currentLocation}
						/>
					)}
					<PageContent code={section.body.code} />
					<Highlighter location={currentLocation} />
					<Pager prev={pagerLinks.prev} next={pagerLinks.next} />
				</section>

				<aside className="toc-sidebar col-span-2 relative">
					<div className="sticky top-20">
						<TocSidebar headings={section.headings} />
					</div>
					<Suspense
						fallback={
							<p className="text-sm text-muted-foreground mt-8">
								<Spinner className="inline mr-2" />
								loading notes
							</p>
						}
					>
						<NoteList location={currentLocation} />
					</Suspense>
				</aside>
			</div>

			{hasSummary && <PageSummary location={currentLocation} />}
		</Fragment>
	);
}

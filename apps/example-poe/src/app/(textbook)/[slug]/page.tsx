import { notFound } from "next/navigation";
import { getPagerLinks } from "@/lib/pager";
import { NoteList } from "@/components/note/note-list";
import { NoteToolbar } from "@/components/note/note-toolbar";
import { Fragment, Suspense } from "react";
import { allPagesSorted } from "@/lib/pages";
import { Pager } from "@/components/client-components";
import { PageToc } from "@/components/page-toc";
import { PageContent } from "@/components/section/page-content";
import { QuestionControl } from "@/components/question/question-control";
import { getCurrentUser } from "@/lib/auth";
import { env } from "@/env.mjs";
import {
	QuestionSchema,
	SelectedQuestions,
	getPageQuestions,
} from "@/lib/question";
import { PageTitle } from "@/components/page-title";
import { getUser } from "@/lib/user";
import { isPageAfter, isPageUnlockedWithoutUser } from "@/lib/location";
import { PageStatusModal } from "@/components/page-status/page-status-modal";
import { EyeIcon, LockIcon, UnlockIcon } from "lucide-react";
import { PageStatus } from "@/components/page-status/page-status";
import { NoteCount } from "@/components/note/note-count";
import { isProduction } from "@/lib/constants";
import { EventTracker } from "@/components/telemetry/event-tracker";
import { Spinner } from "@/components/spinner";
import { getPageStatus } from "@/lib/page-status";

export default async function ({ params }: { params: { slug: string } }) {
	const sessionUser = await getCurrentUser();
	const user = sessionUser ? await getUser(sessionUser.id) : null;
	const whitelist = JSON.parse(env.SUMMARY_WHITELIST || "[]") as string[];
	const isUserWhitelisted = whitelist.includes(user?.email || "");

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

	// Subsections to be passed onto page
	let enableQA = false;
	const selectedQuestions: SelectedQuestions = new Map();

	const questions = await getPageQuestions(pageSlug);
	if (questions) {
		const chunks = questions.data[0].attributes.Content.filter((c) =>
			Boolean(c.QuestionAnswerResponse),
		);

		const chooseQuestion = (c: (typeof chunks)[number]) => {
			if (c.QuestionAnswerResponse) {
				const parsed = JSON.parse(c.QuestionAnswerResponse);
				const questionParsed = QuestionSchema.safeParse(parsed);
				if (questionParsed.success) {
					selectedQuestions.set(c.Slug, questionParsed.data);
				}
			}
		};
		if (chunks.length > 0) {
			enableQA = true;
			chunks.forEach((chunk) => {
				if (Math.random() < 1 / 3) {
					chooseQuestion(chunk);
				}
			});

			// Each page will have at least one question
			if (selectedQuestions.size === 0) {
				const randChunk = Math.floor(Math.random() * (chunks.length - 1));
				chooseQuestion(chunks[randChunk]);
			}
		}
	}
	const pageStatus = getPageStatus(pageSlug, user?.pageSlug);
	const { isPageLatest, isPageUnlocked } = pageStatus;

	return (
		<Fragment>
			<section className="page-content relative col-span-8">
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

			<aside className="toc-sidebar col-span-2 relative">
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

			<PageStatusModal user={user} pageStatus={pageStatus} />
			{enableQA && (
				<QuestionControl
					isPageUnlocked={isPageUnlocked}
					selectedQuestions={selectedQuestions}
					pageSlug={pageSlug}
				/>
			)}

			{user && isProduction && <EventTracker user={user} />}
		</Fragment>
	);
}

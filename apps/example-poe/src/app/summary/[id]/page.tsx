import SummaryOperations from "@/components/dashboard/summary-operations";
import { ScoreBadge } from "@/components/score/badge";
import { SummaryBackButton } from "@/components/summary/summary-back-button";
import { getCurrentUser } from "@/lib/auth";
import { allChaptersSorted, isLastChapter } from "@/lib/chapters";
import {
	DEFAULT_TIME_ZONE,
	PAGE_SUMMARY_THRESHOLD,
	ScoreType,
} from "@/lib/constants";
import db from "@/lib/db";
import { getUser } from "@/lib/user";
import { cn, relativeDate } from "@itell/core/utils";
import { Badge, buttonVariants } from "@itell/ui/server";
import { Summary, User } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { makeChapterHref } from "@/lib/utils";
import {
	ErrorType,
	SummaryFormState,
	getFeedback,
	simpleFeedback,
	validateSummary,
} from "@itell/core/summary";
import { getScore } from "@/lib/score";
import { isChapterWithFeedback } from "@/lib/chapter";
import {
	getUserChapterSummaryCount,
	incrementUserChapter,
	updateSummary,
} from "@/lib/server-actions";
import { SummaryForm } from "@/components/summary/summary-form";
import { revalidatePath } from "next/cache";

async function getSummaryForUser(summaryId: Summary["id"], userId: User["id"]) {
	return await db.summary.findFirst({
		where: {
			id: summaryId,
			userId: userId,
		},
	});
}

interface PageProps {
	params: {
		id: string;
	};
}

export default async function ({ params }: PageProps) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return redirect("/auth");
	}
	const user = await getUser(currentUser.id);

	if (!user) {
		return notFound();
	}
	const summary = await getSummaryForUser(params.id, user.id);

	if (!summary) {
		return notFound();
	}

	const chapter = allChaptersSorted.find((c) => c.chapter === summary.chapter);
	if (!chapter) {
		return notFound();
	}
	const isFeedbackEnabled = isChapterWithFeedback(chapter.chapter);

	const onSubmit = async (
		prevState: SummaryFormState,
		formData: FormData,
	): Promise<SummaryFormState> => {
		"use server";
		const input = formData.get("input") as string;

		const error = await validateSummary(input);
		if (error) {
			return { error, canProceed: false, response: null, feedback: null };
		}
		const response = await getScore({ input, chapter: chapter.chapter });

		if (!response.success) {
			return {
				// response parsing error
				error: ErrorType.INTERNAL,
				canProceed: false,
				response: null,
				feedback: null,
			};
		}

		const feedback = isFeedbackEnabled
			? getFeedback(response.data)
			: simpleFeedback();

		await updateSummary(params.id, {
			text: input,
			isPassed: feedback.isPassed,
			containmentScore: response.data.containment,
			similarityScore: response.data.similarity,
			wordingScore: response.data.wording,
			contentScore: response.data.content,
		});

		revalidatePath(`/summary/${params.id}`);

		if (feedback.isPassed) {
			await incrementUserChapter(user.id, chapter.chapter);

			return {
				canProceed: !isLastChapter(chapter.chapter),
				response: response.data,
				feedback,
				error: null,
			};
		}

		const summaryCount = await getUserChapterSummaryCount(
			user.id,
			chapter.chapter,
		);
		if (summaryCount >= PAGE_SUMMARY_THRESHOLD) {
			await incrementUserChapter(user.id, chapter.chapter);
			return {
				canProceed: !isLastChapter(chapter.chapter),
				response: response.data,
				feedback,
				error: null,
			};
		}

		return {
			canProceed: false,
			response: null,
			feedback,
			error: null,
		};
	};

	return (
		<div className="px-32 py-4">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center space-x-10">
					<SummaryBackButton />
					<p className="text-sm text-muted-foreground">
						{`Created at ${relativeDate(
							summary.created_at,
							user.timeZone || DEFAULT_TIME_ZONE,
						)}`}
					</p>
				</div>
				<SummaryOperations summary={summary} />
			</div>
			<div className="grid gap-12 md:grid-cols-[200px_1fr] mt-4">
				<aside className="hidden w-[200px] flex-col md:flex space-y-4">
					<div className="flex items-center justify-center">
						<Badge variant={summary.isPassed ? "default" : "destructive"}>
							{summary.isPassed ? "Passed" : "Failed"}
						</Badge>
					</div>
					<p className="tracking-tight text-sm text-muted-foreground">
						Revise your summary here.
					</p>
					<div className="flex flex-col gap-2">
						<ScoreBadge
							type={ScoreType.containment}
							score={summary.containmentScore}
						/>
						<ScoreBadge
							type={ScoreType.similarity}
							score={summary.similarityScore}
						/>
						<ScoreBadge type={ScoreType.wording} score={summary.wordingScore} />
						<ScoreBadge type={ScoreType.content} score={summary.contentScore} />
					</div>
				</aside>
				<div className="space-y-2">
					<Link
						href={makeChapterHref(chapter.chapter)}
						className={cn(
							buttonVariants({ variant: "link" }),
							"block text-xl font-semibold text-center underline",
						)}
					>
						{chapter.title}
					</Link>
					<p className="text-sm text-muted-foreground text-center">
						{`Last updated at ${relativeDate(summary.updated_at)}`}
					</p>
					<div className="max-w-2xl mx-auto">
						<SummaryForm
							isFeedbackEnabled={isFeedbackEnabled}
							chapter={chapter.chapter}
							onSubmit={onSubmit}
							textareaClassName="min-h-[400px]"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

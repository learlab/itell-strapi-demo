import { SummaryOperations } from "@/components/dashboard/summary-operations";
import { FormState } from "@/components/summary/page-summary";
import { SummaryBackButton } from "@/components/summary/summary-back-button";
import { SummaryFeedback } from "@/components/summary/summary-feedback";
import { SummaryForm } from "@/components/summary/summary-form";
import { TextbookPageModal } from "@/components/textbook-page-modal";
import { getCurrentUser } from "@/lib/auth";
import { PAGE_SUMMARY_THRESHOLD, ScoreType } from "@/lib/constants";
import db from "@/lib/db";
import { isPageWithFeedback } from "@/lib/feedback";
import { isLastPage } from "@/lib/location";
import { getPageStatus } from "@/lib/page-status";
import { allPagesSorted } from "@/lib/pages";
import {
	getUserPageSummaryCount,
	incrementUserPage,
	isPageQuizUnfinished,
	updateSummary,
} from "@/lib/server-actions";
import { getFeedback, getSummaryResponse } from "@/lib/summary";
import {
	ErrorType,
	SummaryFeedback as SummaryFeedbackType,
	simpleFeedback,
	validateSummary,
} from "@itell/core/summary";
import { relativeDate } from "@itell/core/utils";
import { Badge } from "@itell/ui/server";
import { Summary, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

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

const initialState: FormState = {
	feedback: null,
	canProceed: false,
	error: null,
	showQuiz: false,
};

export default async function ({ params }: PageProps) {
	const user = await getCurrentUser();
	if (!user) {
		return redirect("/auth");
	}
	const summary = await getSummaryForUser(params.id, user.id);

	if (!summary) {
		return notFound();
	}

	const page = allPagesSorted.find(
		(section) => section.page_slug === summary.pageSlug,
	);
	if (!page) {
		return notFound();
	}

	const pageSlug = page.page_slug;
	const isFeedbackEnabled = isPageWithFeedback(user, page);

	const onSubmit = async (
		prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		"use server";
		const input = formData.get("input") as string;

		const error = await validateSummary(input);
		if (error) {
			return { ...prevState, error };
		}

		let feedback: SummaryFeedbackType | null = null;
		const { summaryResponse } = await getSummaryResponse({
			input,
			pageSlug,
			userId: user.id,
		});
		if (!summaryResponse) {
			return { ...prevState, feedback: null, error: ErrorType.INTERNAL };
		}

		if (!summaryResponse.english) {
			return {
				...prevState,
				feedback: null,
				error: ErrorType.LANGUAGE_NOT_EN,
			};
		}

		feedback = getFeedback(summaryResponse);

		await updateSummary(params.id, {
			text: input,
			isPassed: feedback.isPassed,
			containmentScore: summaryResponse.containment,
			similarityScore: summaryResponse.similarity,
			wordingScore: summaryResponse.wording,
			contentScore: summaryResponse.content,
		});

		revalidatePath(`/summary/${params.id}`);

		const showQuiz = page.quiz ? isPageQuizUnfinished(pageSlug) : false;

		if (feedback.isPassed) {
			await incrementUserPage(user.id, summary.pageSlug);

			return {
				canProceed: !isLastPage(summary.pageSlug),
				feedback,
				error: null,
				showQuiz,
			};
		}

		const summaryCount = await getUserPageSummaryCount(
			user.id,
			summary.pageSlug,
		);
		if (summaryCount >= PAGE_SUMMARY_THRESHOLD) {
			await incrementUserPage(user.id, summary.pageSlug);
			return {
				canProceed: !isLastPage(summary.pageSlug),
				feedback,
				error: null,
				showQuiz,
			};
		}

		return {
			canProceed: false,
			feedback,
			error: null,
			showQuiz: false,
		};
	};

	return (
		<div className="px-32 py-4">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center space-x-10">
					<SummaryBackButton />
					<p className="text-sm text-muted-foreground">
						{`Created at ${relativeDate(summary.created_at)}`}
					</p>
				</div>
				<SummaryOperations summary={summary} pageUrl={page.url} />
			</div>
			<div className="grid gap-12 md:grid-cols-[200px_1fr] mt-4">
				<aside className="w-[200px] space-y-4">
					<div className="flex items-center justify-center">
						<Badge variant={summary.isPassed ? "default" : "destructive"}>
							{summary.isPassed ? "Passed" : "Failed"}
						</Badge>
					</div>
					<p className="tracking-tight text-sm text-muted-foreground">
						Revise your summary here. After getting a new score, you can choose
						to update the old summary.
					</p>
					<p className="tracking-tight text-sm text-muted-foreground">
						Click on the title to review this page's content.
					</p>
				</aside>
				<div className="space-y-2">
					<div className="text-center">
						<TextbookPageModal page={page} />
					</div>

					<p className="text-sm text-muted-foreground text-center">
						{`Last updated at ${relativeDate(summary.updated_at)}`}
					</p>
					<div className="max-w-2xl mx-auto">
						<SummaryForm
							inputEnabled={true}
							value={summary.text}
							onSubmit={onSubmit}
							pageSlug={pageSlug}
							isFeedbackEnabled={isFeedbackEnabled}
							initialState={initialState}
							textareaClassName="min-h-[400px]"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

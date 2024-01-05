import { Suspense } from "react";
import { SummaryCount } from "./summary-count";
import { SummaryDescription } from "./summary-description";
import { getCurrentUser } from "@/lib/auth";
import {
	ErrorType,
	SummaryFormState,
	getFeedback,
	simpleFeedback,
	validateSummary,
} from "@itell/core/summary";
import { getScore } from "@/lib/score";
import {
	createSummary,
	getUserPageSummaryCount,
	incrementUserPage,
	isPageQuizUnfinished,
	maybeCreateQuizCookie,
} from "@/lib/server-actions";
import {
	isLastPage,
	isPageAfter,
	isPageUnlockedWithoutUser,
} from "@/lib/location";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { Warning } from "@itell/ui/server";
import { SummaryForm } from "./summary-form";
import { getUser } from "@/lib/user";
import { allPagesSorted } from "@/lib/pages";
import { Page } from "contentlayer/generated";
import { getPageStatus } from "@/lib/page-status";

type Props = {
	pageSlug: string;
};

export type FormState = SummaryFormState & {
	showQuiz: boolean;
};

const initialState: FormState = {
	response: null,
	feedback: null,
	canProceed: false,
	error: null,
	showQuiz: false,
};

export const PageSummary = async ({ pageSlug }: Props) => {
	const sessionUser = await getCurrentUser();
	const user = await getUser(sessionUser?.id || "");
	const page = allPagesSorted.find((p) => p.page_slug === pageSlug) as Page;

	const onSubmit = async (
		prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		"use server";
		if (!sessionUser) {
			return {
				...prevState,
				error: ErrorType.INTERNAL,
			};
		}

		const input = formData.get("input") as string;
		const userId = sessionUser.id as string; // this won't be null when called in summary-input

		const error = await validateSummary(input);
		if (error) {
			return { ...prevState, error };
		}

		const response = await getScore({ input, pageSlug });

		if (!response.success) {
			return {
				...prevState,
				error: ErrorType.INTERNAL,
			};
		}
		const feedback = sessionUser.feedback
			? getFeedback(response.data)
			: simpleFeedback();

		await createSummary({
			text: input,
			pageSlug,
			isPassed: feedback.isPassed,
			containmentScore: response.data.containment,
			similarityScore: response.data.similarity,
			wordingScore: response.data.wording,
			contentScore: response.data.content,
			user: {
				connect: {
					id: userId,
				},
			},
		});

		if (page.quiz) {
			maybeCreateQuizCookie(pageSlug);
		}

		const showQuiz = page.quiz ? isPageQuizUnfinished(pageSlug) : false;

		if (feedback.isPassed) {
			await incrementUserPage(userId, pageSlug);

			return {
				canProceed: !isLastPage(pageSlug),
				response: response.data,
				feedback,
				error: null,
				showQuiz,
			};
		}

		const summaryCount = await getUserPageSummaryCount(userId, pageSlug);
		if (summaryCount >= PAGE_SUMMARY_THRESHOLD) {
			await incrementUserPage(userId, pageSlug);

			return {
				canProceed: !isLastPage(pageSlug),
				response: response.data,
				feedback,
				error: null,
				showQuiz,
			};
		}

		return {
			canProceed: false,
			response: null,
			feedback,
			error: null,
			showQuiz: false,
		};
	};

	const pageStatus = getPageStatus(pageSlug, user?.pageSlug);
	return (
		<section
			className="flex flex-col sm:flex-row gap-8 mt-10 border-t-2 py-4"
			id="page-summary"
		>
			<section className="sm:basis-1/3">
				<SummaryDescription />
			</section>
			<section className="sm:basis-2/3">
				{user ? (
					<>
						<Suspense fallback={<SummaryCount.Skeleton />}>
							<SummaryCount pageSlug={pageSlug} />
						</Suspense>
						<SummaryForm
							pageSlug={pageSlug}
							onSubmit={onSubmit}
							initialState={initialState}
							pageStatus={pageStatus}
						/>
					</>
				) : (
					<Warning>
						You need to be logged in to submit a summary for this page and move
						forward
					</Warning>
				)}
			</section>
		</section>
	);
};

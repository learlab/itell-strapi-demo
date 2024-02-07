import { getCurrentUser } from "@/lib/auth";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { isLastPage } from "@/lib/location";
import { allPagesSorted } from "@/lib/pages";
import {
	createSummary,
	getUserPageSummaryCount,
	incrementUserPage,
	isPageQuizUnfinished,
	maybeCreateQuizCookie,
} from "@/lib/server-actions";
import { getScore } from "@/lib/summary";
import {
	ErrorType,
	SummaryFeedbackType,
	SummaryFormState,
	getFeedback,
	simpleFeedback,
	validateSummary,
} from "@itell/core/summary";
import { Warning } from "@itell/ui/server";
import { Page } from "contentlayer/generated";
import { Fragment, Suspense } from "react";
import { SummaryCount } from "./summary-count";
import { SummaryDescription } from "./summary-description";
import { SummaryForm } from "./summary-form";

type Props = {
	pageSlug: string;
	isFeedbackEnabled: boolean;
};

export type FormState = SummaryFormState & {
	showQuiz: boolean;
};

const initialState: FormState = {
	feedback: null,
	canProceed: false,
	error: null,
	showQuiz: false,
};

export const PageSummary = async ({ pageSlug, isFeedbackEnabled }: Props) => {
	const user = await getCurrentUser();
	const page = allPagesSorted.find((p) => p.page_slug === pageSlug) as Page;

	if (!user) {
		return (
			<section
				className="flex flex-col sm:flex-row gap-8 mt-10 border-t-2 py-4"
				id="page-summary"
			>
				<section className="sm:basis-1/3">
					<SummaryDescription />
				</section>
				<section className="sm:basis-2/3">
					<Warning>
						You need to be logged in to submit a summary for this page and move
						forward
					</Warning>
				</section>
			</section>
		);
	}

	const onSubmit = async (
		prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		"use server";
		if (!user) {
			return {
				...prevState,
				error: ErrorType.INTERNAL,
			};
		}

		const input = formData.get("input") as string;
		const userId = user.id;

		const error = await validateSummary(input);
		if (error) {
			return { ...prevState, error };
		}

		let feedback: SummaryFeedbackType;
		try {
			if (isFeedbackEnabled) {
				const response = await getScore({ input, pageSlug });
				if (!response.success) {
					return {
						...prevState,
						error: ErrorType.INTERNAL,
					};
				}
				feedback = getFeedback(response.data);
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
			} else {
				feedback = simpleFeedback();
				await createSummary({
					text: input,
					pageSlug,
					isPassed: feedback.isPassed,
					containmentScore: -1,
					similarityScore: -1,
					wordingScore: -1,
					contentScore: -1,
					user: {
						connect: {
							id: userId,
						},
					},
				});
			}

			if (page.quiz) {
				maybeCreateQuizCookie(pageSlug);
			}

			const showQuiz = page.quiz ? isPageQuizUnfinished(pageSlug) : false;

			if (feedback.isPassed) {
				await incrementUserPage(userId, pageSlug);

				return {
					canProceed: !isLastPage(pageSlug),
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
					feedback,
					error: null,
					showQuiz,
				};
			}
		} catch (err) {
			console.log("scoring error", err);
			return {
				...prevState,
				feedback: null,
				error: ErrorType.INTERNAL,
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
		<section
			className="flex flex-col sm:flex-row gap-8 mt-10 border-t-2 py-4"
			id="page-summary"
		>
			<section className="sm:basis-1/3">
				<SummaryDescription />
			</section>
			<section className="sm:basis-2/3">
				<Fragment>
					{isFeedbackEnabled ? (
						<Suspense fallback={<SummaryCount.Skeleton />}>
							<SummaryCount pageSlug={pageSlug} />
						</Suspense>
					) : null}
					<SummaryForm
						pageSlug={pageSlug}
						onSubmit={onSubmit}
						initialState={initialState}
						isFeedbackEnabled={isFeedbackEnabled}
					/>
				</Fragment>
			</section>
		</section>
	);
};

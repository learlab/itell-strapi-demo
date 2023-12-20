import { Suspense } from "react";
import { SummaryCount } from "./summary-count";
import { SummaryDescription } from "./summary-description";
import { getCurrentUser } from "@/lib/auth";
import {
	ErrorType,
	SummaryFormState,
	getFeedback,
	validateSummary,
} from "@itell/core/summary";
import { getScore } from "@/lib/score";
import {
	createSummary,
	getUserPageSummaryCount,
	incrementUserPage,
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

type Props = {
	pageSlug: string;
};

export const PageSummary = async ({ pageSlug }: Props) => {
	const sessionUser = await getCurrentUser();
	const user = await getUser(sessionUser?.id || "");
	const onSubmit = async (
		prevState: SummaryFormState,
		formData: FormData,
	): Promise<SummaryFormState> => {
		"use server";
		const input = formData.get("input") as string;
		const userId = user?.id as string; // this won't be null when called in summary-input

		const error = await validateSummary(input);
		if (error) {
			return { error, canProceed: false, response: null, feedback: null };
		}

		const response = await getScore({ input, pageSlug });

		if (!response.success) {
			return {
				// response parsing error
				error: ErrorType.INTERNAL,
				canProceed: false,
				response: null,
				feedback: null,
			};
		}
		const feedback = getFeedback(response.data);

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

		if (feedback.isPassed) {
			await incrementUserPage(userId, pageSlug);

			return {
				canProceed: !isLastPage(pageSlug),
				response: response.data,
				feedback,
				error: null,
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
			};
		}

		return {
			canProceed: false,
			response: null,
			feedback,
			error: null,
		};
	};

	const disabled = isPageUnlockedWithoutUser(pageSlug)
		? true
		: isPageAfter(pageSlug, user?.pageSlug || null);

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
							disabled={disabled}
							pageSlug={pageSlug}
							onSubmit={onSubmit}
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

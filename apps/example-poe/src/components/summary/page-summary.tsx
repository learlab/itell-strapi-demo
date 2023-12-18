import { Suspense } from "react";
import { SummaryCount } from "./summary-count";
import { SummaryDescription } from "./summary-description";
import { SectionLocation } from "@/types/location";
import { getCurrentUser } from "@/lib/auth";
import {
	ErrorType,
	SummaryFormState,
	getFeedback,
	validateSummary,
} from "@itell/core/summary";
import cld3 from "@/lib/cld";
import { getScore } from "@/lib/score";
import {
	createSummary,
	getUserLocationSummaryCount,
	incrementUserLocation,
} from "@/lib/server-actions";
import { isLastLocation } from "@/lib/location";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { Warning } from "@itell/ui/server";
import { SummaryForm } from "./summary-form";

export const PageSummary = async ({
	location,
}: { location: SectionLocation }) => {
	const user = await getCurrentUser();
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

		const { language } = cld3.findLanguage(input);
		if (language !== "en") {
			return {
				error: ErrorType.LANGUAGE_NOT_EN,
				canProceed: false,
				response: null,
				feedback: null,
			};
		}

		const response = await getScore({ input, location });

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
			module: location.module,
			chapter: location.chapter,
			section: location.section,
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
			await incrementUserLocation(userId, location);

			return {
				canProceed: !isLastLocation(location),
				response: response.data,
				feedback,
				error: null,
			};
		}

		const summaryCount = await getUserLocationSummaryCount(userId, location);
		if (summaryCount >= PAGE_SUMMARY_THRESHOLD) {
			await incrementUserLocation(userId, location);
			return {
				canProceed: !isLastLocation(location),
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
							<SummaryCount location={location} />
						</Suspense>
						<SummaryForm location={location} onSubmit={onSubmit} />
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

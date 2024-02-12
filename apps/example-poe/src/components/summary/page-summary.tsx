import { getCurrentUser } from "@/lib/auth";
import { getPageData } from "@/lib/utils";
import { Warning } from "@itell/ui/server";
import { Fragment, Suspense } from "react";
import { SummaryCount } from "./summary-count";
import { SummaryDescription } from "./summary-description";
import { SummaryForm } from "./summary-form";

type Props = {
	pageSlug: string;
	isFeedbackEnabled: boolean;
};

export const PageSummary = async ({ pageSlug, isFeedbackEnabled }: Props) => {
	const user = await getCurrentUser();
	const page = getPageData(pageSlug);

	if (!page) {
		return <p>No summary found</p>;
	}

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
						user={user}
						page={page}
						hasQuiz={page?.quiz}
						isFeedbackEnabled={isFeedbackEnabled}
					/>
				</Fragment>
			</section>
		</section>
	);
};

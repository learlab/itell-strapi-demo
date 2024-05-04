import { getCurrentUser } from "@/lib/auth";
import { PageStatus } from "@/lib/page-status";
import { getPageData } from "@/lib/utils";
import { Warning } from "@itell/ui/server";
import { Suspense } from "react";
import { SummaryCount } from "./summary-count";
import { SummaryDescription } from "./summary-description";
import { SummaryFormSelector } from "./summary-form-selector";

type Props = {
	pageSlug: string;
	pageStatus: PageStatus;
};

export const PageSummary = async ({ pageSlug, pageStatus }: Props) => {
	const user = await getCurrentUser();
	const page = getPageData(pageSlug);

	if (!page) {
		return <p>No summary found</p>;
	}

	if (!user) {
		return (
			<section
				className="flex flex-col sm:flex-row gap-8 mt-10 border-t-2 py-4 mb-20"
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
		<section className="mt-10 border-t-2 py-4 mb-20 space-y-2">
			<Suspense fallback={<SummaryCount.Skeleton />}>
				<SummaryCount pageSlug={page.page_slug} />
			</Suspense>
			<SummaryFormSelector user={user} pageStatus={pageStatus} page={page} />
		</section>
	);
};

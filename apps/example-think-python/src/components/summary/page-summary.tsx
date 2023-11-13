import { Suspense } from "react";
import { SummaryCount } from "./summary-count";
import { SummaryDescription } from "./summary-description";
import { SummaryInput } from "./summary-input";

export const PageSummary = ({ chapter }: { chapter: number }) => {
	return (
		<section
			className="flex flex-col sm:flex-row gap-8 mt-10 border-t-2 py-4"
			id="page-summary"
		>
			<section className="sm:basis-1/3">
				<SummaryDescription />
			</section>
			<section className="sm:basis-2/3">
				<Suspense fallback={<SummaryCount.Skeleton />}>
					<SummaryCount chapter={chapter} />
				</Suspense>
				<SummaryInput chapter={chapter} />
			</section>
		</section>
	);
};

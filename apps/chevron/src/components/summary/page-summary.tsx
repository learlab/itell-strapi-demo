import { Condition } from "@/lib/control/condition";
import { PageStatus } from "@/lib/page-status";
import { getPageData } from "@/lib/utils";
import { User } from "lucia";
import { Suspense } from "react";
import { SummaryCount } from "./summary-count";
import { SummaryDescription } from "./summary-description";
import { SummaryFormReread } from "./summary-form-reread";
import { SummaryFormSimple } from "./summary-form-simple";
import { SummaryFormStairs } from "./summary-form-stairs";

type Props = {
	pageSlug: string;
	pageStatus: PageStatus;
	user: User;
	condition: string;
};

export const PageSummary = async ({
	pageSlug,
	pageStatus,
	user,
	condition,
}: Props) => {
	const page = getPageData(pageSlug);
	if (!page) {
		return <p>no summary found</p>;
	}

	return (
		<section className="mt-10 border-t-2 py-4 mb-20 space-y-2 p-4 lg:p-8">
			<section
				className="grid gird-cols-1 lg:grid-cols-3 gap-8"
				id="page-summary"
			>
				{condition === Condition.SIMPLE ? (
					<section className="col-span-full max-w-2xl mx-auto space-y-4">
						<SummaryFormSimple
							user={user}
							page={page}
							pageStatus={pageStatus}
						/>
					</section>
				) : (
					<>
						<section className="col-span-full hidden md:block lg:col-span-1">
							<SummaryDescription condition={condition} />
							{condition !== Condition.SIMPLE && (
								<Suspense fallback={<SummaryCount.Skeleton />}>
									<div className="mt-8">
										<SummaryCount pageSlug={page.page_slug} userId={user.id} />
									</div>
								</Suspense>
							)}
						</section>

						<section className="col-span-full lg:col-span-2">
							{condition === Condition.RANDOM_REREAD ? (
								<SummaryFormReread
									user={user}
									page={page}
									pageStatus={pageStatus}
								/>
							) : condition === Condition.STAIRS ? (
								<SummaryFormStairs
									user={user}
									page={page}
									pageStatus={pageStatus}
								/>
							) : null}
						</section>
					</>
				)}
			</section>
		</section>
	);
};

import { Condition } from "@/lib/control/condition";
import { PageStatus } from "@/lib/page-status";
import { getPageData } from "@/lib/utils";
import { Elements } from "@itell/core/constants";
import { User } from "lucia";
import { Suspense } from "react";
import { SummaryCount } from "./summary-count";
import { SummaryDescription } from "./summary-description";
import { SummaryFormReread } from "./summary-form-reread";
import { SummaryFormSimple } from "./summary-form-simple";
import { SummaryFormStairs } from "./summary-form-stairs";
import { SurveyLink } from "./survey-link";

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
		<div
			className="mt-10 border-t-2 py-4 mb-20 space-y-2 p-4 lg:p-8"
			id={Elements.PAGE_ASSIGNMENTS}
		>
			<div className="grid gird-cols-1 lg:grid-cols-3 gap-8">
				{condition === Condition.SIMPLE ? (
					<div className="col-span-full max-w-2xl mx-auto space-y-4">
						<SurveyLink user={user} />
						<SummaryFormSimple
							user={user}
							page={page}
							pageStatus={pageStatus}
						/>
					</div>
				) : (
					<>
						<div className="col-span-full hidden md:block lg:col-span-1">
							<SummaryDescription condition={condition} />
							{condition !== Condition.SIMPLE && (
								<Suspense fallback={<SummaryCount.Skeleton />}>
									<div className="mt-8">
										<SummaryCount pageSlug={page.page_slug} userId={user.id} />
									</div>
								</Suspense>
							)}
						</div>

						<div className="col-span-full lg:col-span-2">
							<SurveyLink user={user} />
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
						</div>
					</>
				)}
			</div>
		</div>
	);
};

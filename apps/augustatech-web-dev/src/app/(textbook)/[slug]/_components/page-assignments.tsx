import { Condition, Elements } from "@/lib/constants";
import { PageStatus } from "@/lib/page-status";
import { getPageData } from "@/lib/utils";
import { User } from "lucia";
import { Suspense } from "react";
import { SummaryCount } from "./summary/summary-count";
import { SummaryDescription } from "./summary/summary-description";
import { SummaryFormReread } from "./summary/summary-form-reread";
import { SummaryFormSimple } from "./summary/summary-form-simple";
import { SummaryFormStairs } from "./summary/summary-form-stairs";

type Props = {
	pageSlug: string;
	pageStatus: PageStatus;
	user: User;
	condition: string;
};

export const PageAssignments = async ({
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
		<section
			className="grid gird-cols-1 lg:grid-cols-3 gap-8 p-4 lg:p-8 border-t-2 mb-20 "
			id={Elements.PAGE_ASSIGNMENTS}
			aria-labelledby="page-assignments-heading"
		>
			<h2 className="sr-only" id="page-assignments-heading">
				assignments
			</h2>
			{condition === Condition.SIMPLE ? (
				<div className="col-span-full max-w-2xl mx-auto space-y-4">
					<SummaryFormSimple page={page} pageStatus={pageStatus} />
				</div>
			) : (
				<>
					<div className="col-span-full hidden md:block lg:col-span-1">
						<SummaryDescription condition={condition} />
						{condition !== Condition.SIMPLE && (
							<Suspense fallback={<SummaryCount.Skeleton />}>
								<div className="mt-8">
									<SummaryCount pageSlug={page.page_slug} />
								</div>
							</Suspense>
						)}
					</div>

					<div className="col-span-full lg:col-span-2">
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
		</section>
	);
};

import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { cn } from "@itell/core/utils";
import { Skeleton, buttonVariants } from "@itell/ui/server";
import Link from "next/link";
import pluralize from "pluralize";

export const SummaryCount = async ({ chapter }: { chapter: number }) => {
	const user = await getCurrentUser();
	if (!user) {
		return null;
	}
	const summaryByPassing = await db.summary.groupBy({
		by: ["isPassed"],
		_count: {
			isPassed: true,
		},
		where: {
			userId: user.id,
			chapter: chapter,
		},
	});
	const passedSummaryCount =
		summaryByPassing.find((item) => item.isPassed)?._count.isPassed || 0;
	const failedSummaryCount =
		summaryByPassing.find((item) => !item.isPassed)?._count.isPassed || 0;
	const summaryCount = passedSummaryCount + failedSummaryCount;

	if (!summaryCount) {
		return null;
	}

	return (
		<p className="text-sm">
			<Link
				href="/dashboard/summaries"
				className={cn(buttonVariants({ variant: "link" }), "pl-0")}
			>
				You have written {pluralize("summary", summaryCount, true)} for this
				section.
				{summaryCount > 0 && (
					<span className="ml-1">
						{passedSummaryCount} passed, {failedSummaryCount} failed.
					</span>
				)}
			</Link>
		</p>
	);
};

SummaryCount.Skeleton = () => <Skeleton className="w-48 h-8" />;

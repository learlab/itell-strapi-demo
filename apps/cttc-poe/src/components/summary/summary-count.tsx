import { summaries } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { Skeleton } from "@itell/ui/server";
import { and, count, eq } from "drizzle-orm";
import Link from "next/link";
import pluralize from "pluralize";

type Props = {
	userId: string;
	pageSlug: string;
};

export const SummaryCount = async ({ pageSlug, userId }: Props) => {
	const summaryByPassing = await db
		.select({ isPassed: summaries.isPassed, count: count() })
		.from(summaries)
		.where(and(eq(summaries.userId, userId), eq(summaries.pageSlug, pageSlug)))
		.groupBy(summaries.isPassed);
	const passedSummaryCount =
		summaryByPassing.find((item) => item.isPassed)?.count || 0;
	const failedSummaryCount =
		summaryByPassing.find((item) => !item.isPassed)?.count || 0;
	const summaryCount = passedSummaryCount + failedSummaryCount;

	if (!summaryCount) {
		return null;
	}

	return (
		<Link
			className="text-sm xl:text-base font-medium underline-offset-4 hover:underline text-pretty"
			href="/dashboard/summaries"
		>
			<p>
				You have written {pluralize("summary", summaryCount, true)} for this
				section.
				{summaryCount > 0 && (
					<span className="ml-1">
						{passedSummaryCount} passed, {failedSummaryCount} failed.
					</span>
				)}
			</p>
		</Link>
	);
};

SummaryCount.Skeleton = () => <Skeleton className="w-48 h-8" />;

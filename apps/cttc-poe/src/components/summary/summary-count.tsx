import { summaries } from "@/drizzle/schema";
import { SessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn } from "@itell/core/utils";
import { Skeleton, buttonVariants } from "@itell/ui/server";
import { and, count, eq } from "drizzle-orm";
import Link from "next/link";
import pluralize from "pluralize";

type Props = {
	user: NonNullable<SessionUser>;
	pageSlug: string;
};

export const SummaryCount = async ({ pageSlug, user }: Props) => {
	const summaryByPassing = await db
		.select({ isPassed: summaries.isPassed, count: count() })
		.from(summaries)
		.where(and(eq(summaries.userId, user.id), eq(summaries.pageSlug, pageSlug)))
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

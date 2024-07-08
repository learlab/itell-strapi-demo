import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SummaryList } from "@/components/dashboard/summary-list";
import { PageLink } from "@/components/page/page-link";
import { DashboardShell } from "@/components/page/shell";
import { getSession } from "@/lib/auth";
import { incrementView } from "@/lib/dashboard/actions";
import { allPagesSorted, firstSummaryPage } from "@/lib/pages";
import { getUserSummaries } from "@/lib/summary";
import { delay } from "@/lib/utils";
import { groupby } from "@itell/core/utils";
import { Card, CardContent } from "@itell/ui/server";
import { redirect } from "next/navigation";
import { Chart } from "./chart";

export default async function () {
	const { user } = await getSession();
	if (!user) {
		return redirect("/auth");
	}

	incrementView(user.id, "summaries");

	const userSummaries = await getUserSummaries(user.id);

	if (userSummaries.length === 0) {
		return (
			<DashboardShell>
				<DashboardHeader heading="Summary" text="Manage summaries." />
				<Card>
					<CardContent>
						You have not made any summary yet. Start with{" "}
						<PageLink
							pageSlug={firstSummaryPage.page_slug}
							className="underline font-medium"
						>
							{firstSummaryPage.title}
						</PageLink>
						!
					</CardContent>
				</Card>
			</DashboardShell>
		);
	}

	const summaries = userSummaries
		.map((s) => {
			const page = allPagesSorted.find((page) => page.page_slug === s.pageSlug);

			if (!page) {
				return undefined;
			}

			return {
				...s,
				chapter: page.chapter,
				pageTitle: page.title,
			};
		})
		.filter((s) => s !== undefined);

	const summariesByChapter = groupby(summaries, (summary) => summary.chapter);

	const summariesByPassing = summaries.reduce(
		(acc, summary) => {
			if (summary.isPassed) {
				acc.passed += 1;
			} else {
				acc.failed += 1;
			}

			if (summary.updatedAt < acc.startDate) {
				acc.startDate = summary.createdAt;
			}

			if (summary.updatedAt > acc.endDate) {
				acc.endDate = summary.createdAt;
			}

			return acc;
		},
		{ passed: 0, failed: 0, startDate: new Date(), endDate: new Date() },
	);
	const chartData = [
		{
			name: "passed",
			value: summariesByPassing.passed,
			fill: "var(--color-passed)",
		},
		{
			name: "failed",
			value: summariesByPassing.failed,
			fill: "var(--color-failed)",
		},
	];

	return (
		<DashboardShell>
			<DashboardHeader heading="Summary" text="Create and manage summaries." />
			<Card className="w-full">
				<CardContent className="space-y-4">
					<Chart
						data={chartData}
						startDate={summariesByPassing.startDate.toLocaleDateString()}
						endDate={summariesByPassing.endDate.toLocaleDateString()}
						totalCount={summaries.length}
					/>
					<SummaryList
						summariesByChapter={summariesByChapter}
						userTimeZone={user.timeZone}
					/>
				</CardContent>
			</Card>
		</DashboardShell>
	);
}

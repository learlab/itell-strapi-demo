import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SummaryList } from "@/components/dashboard/summary-list";
import { PageLink } from "@/components/page/page-link";
import { DashboardShell } from "@/components/page/shell";
import { getCurrentUser } from "@/lib/auth";
import { incrementView } from "@/lib/dashboard/actions";
import db from "@/lib/db";
import { allPagesSorted, firstPage } from "@/lib/pages";
import { getUser } from "@/lib/user";
import { makePageHref } from "@/lib/utils";
import { groupby } from "@itell/core/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function () {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return redirect("/auth");
	}

	incrementView("summary");

	const [user, userSummaries] = await Promise.all([
		getUser(currentUser.id),
		db.summary.findMany({
			where: {
				userId: currentUser.id,
			},
			orderBy: [{ created_at: "desc" }],
		}),
	]);

	if (!user || !userSummaries) {
		return notFound();
	}

	if (userSummaries.length === 0) {
		return (
			<DashboardShell>
				<DashboardHeader
					heading="Summary"
					text="Create and manage summaries."
				/>
				<p className="p-2">
					You have not made any summary yet. Start with{" "}
					<PageLink
						pageSlug={firstPage.page_slug}
						className="underline font-medium"
					>
						{firstPage.title}
					</PageLink>
					!
				</p>
			</DashboardShell>
		);
	}

	// // convert date here since they will be passed from server components to client components
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
		.filter(Boolean);

	const summariesByChapter = groupby(summaries, (summary) => summary.chapter);

	return (
		<DashboardShell>
			<DashboardHeader heading="Summary" text="Create and manage summaries." />
			<SummaryList summariesByChapter={summariesByChapter} user={user} />
		</DashboardShell>
	);
}

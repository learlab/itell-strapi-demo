import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import SummaryCreateButton from "@/components/dashboard/summary-create-button";
import { SummaryList } from "@/components/dashboard/summary-list";
import { DashboardShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { allPagesSorted } from "@/lib/pages";
import { getUser } from "@/lib/user";
import { groupby } from "@itell/core/utils";
import { User } from "@prisma/client";
import { Page } from "contentlayer/generated";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function () {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return redirect("/auth");
	}

	const [user, userSummaries] = await Promise.all([
		getUser(currentUser.id),
		db.summary.findMany({
			where: {
				userId: currentUser.id,
			},
			orderBy: [{ created_at: "desc" }],
		}),
	]);

	if (!userSummaries) {
		return notFound();
	}

	if (userSummaries.length === 0) {
		return (
			<DashboardShell>
				<DashboardHeader heading="Summary" text="Create and manage summaries.">
					<SummaryCreateButton />
				</DashboardHeader>
				<p className="p-2">
					You have not made any summary yet. Start with{" "}
					<Link
						href="/module-1/chapter-1/section-1"
						className="underline font-medium"
					>
						Section 1
					</Link>
					!
				</p>
			</DashboardShell>
		);
	}

	// // convert date here since they will be passed from server components to client components
	const summaries = userSummaries.map((s) => {
		const page = allPagesSorted.find(
			(section) => section.page_slug === s.pageSlug,
		) as Page;

		return {
			...s,
			module: page.location.module as number,
			pageTitle: page.title,
		};
	});

	const summariesByModule = groupby(summaries, (summary) => summary.module);

	return (
		<DashboardShell>
			<DashboardHeader heading="Summary" text="Create and manage summaries." />
			<SummaryList summariesByModule={summariesByModule} user={user as User} />
		</DashboardShell>
	);
}

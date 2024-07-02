import { DashboardNav } from "@/components/nav/dashboard-nav";
import { DashboardSidebar } from "@/components/nav/dashboard-sidebar";
import SiteNav from "@/components/nav/site-nav";
import { dashboardConfig } from "@/config/dashboard";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/control/condition";
import { Suspense } from "react";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await getSession();

	return (
		<div className="min-h-screen">
			<SiteNav>
				<DashboardNav items={dashboardConfig.mainNav} />
			</SiteNav>
			<div className="grid md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] flex-col md:flex border-r-2">
					<Suspense fallback={<DashboardSidebar.Skeleton />}>
						<DashboardSidebar />
					</Suspense>
				</aside>
				<main className="flex flex-col px-4 py-4 lg:px-8 max-w-screen-xl">
					{user?.condition !== Condition.SIMPLE ? (
						children
					) : (
						<p>data unavailable</p>
					)}
				</main>
			</div>
		</div>
	);
}

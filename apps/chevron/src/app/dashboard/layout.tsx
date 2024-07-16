import { ContinueReading } from "@/components/continue-reading";
import { SiteNav } from "@/components/site-nav";
import { getSiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/control/condition";
import { delay, redirectWithSearchParams } from "@/lib/utils";
import {
	DashboardNav,
	DashboardSidebar,
	dashboardConfig,
} from "@dashboard/dashboard-nav";

export default async function DashboardLayout({
	children,
	searchParams,
}: {
	children: React.ReactNode;
	searchParams?: unknown;
}) {
	const { user } = await getSession();
	if (!user) {
		return redirectWithSearchParams("auth", searchParams);
	}

	if (user?.condition === Condition.SIMPLE) {
		return (
			<div className="min-h-screen">
				<SiteNav>
					<DashboardNav items={dashboardConfig.mainNav} />
				</SiteNav>
				<div>
					<p>data unavailable</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<SiteNav>
				<DashboardNav items={dashboardConfig.mainNav} />
			</SiteNav>
			<div className="grid md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] flex-col md:flex border-r-2">
					<DashboardSidebar />
				</aside>
				<main className="flex flex-col px-4 py-4 lg:px-8 max-w-screen-xl">
					{children}
				</main>
			</div>
		</div>
	);
}

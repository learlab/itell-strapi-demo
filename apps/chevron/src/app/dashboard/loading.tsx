import { SiteNav } from "@/components/site-nav";
import {
	DashboardNav,
	DashboardSidebar,
	dashboardConfig,
} from "@dashboard/dashboard-nav";
import { Skeleton } from "@itell/ui/server";

export default function () {
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
					<Skeleton className="w-full h-[600px]" />
				</main>
			</div>
		</div>
	);
}

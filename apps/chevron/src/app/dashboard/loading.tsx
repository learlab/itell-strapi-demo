import { SiteNav } from "@/components/site-nav";
import {
	DashboardNav,
	DashboardSidebar,
	dashboardConfig,
} from "@dashboard/dashboard-nav";
import { Skeleton } from "@itell/ui/server";

export default function () {
	return <Skeleton className="w-full h-screen" />;
}

import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/auth";
import { isTeacher } from "@/lib/user";
import { Skeleton } from "@itell/ui/server";
import { DashboardSidebarItem } from "./dashboard-sidebar-item";

export const DashboardSidebar = async () => {
	const user = await getCurrentUser();
	if (!user) {
		return null;
	}
	const teacher = await isTeacher(user.id);
	const items = teacher
		? dashboardConfig.sidebarNav.filter((i) => i.title === "Class")
		: dashboardConfig.sidebarNav;

	return (
		<nav className="grid items-start gap-2">
			{items.map((item) => (
				<DashboardSidebarItem key={item.title} item={item} />
			))}
		</nav>
	);
};

DashboardSidebar.Skeleton = () => (
	<nav className="grid items-start gap-2">
		{Array.from({ length: 4 }).map((_, i) => (
			<Skeleton key={i} className="h-8" />
		))}
	</nav>
);

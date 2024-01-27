import { DashboardNav } from "@/components/nav/dashboard-nav";
import { DashboardSidebar } from "@/components/nav/dashboard-sidebar";
import { dashboardConfig } from "@/config/dashboard";

export default async function DashboardLayout({
	children,
	searchParams,
}: {
	children: React.ReactNode;
	searchParams?: Record<string, string>;
}) {
	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container py-4">
					<DashboardNav items={dashboardConfig.mainNav} />
				</div>
			</header>
			<div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] flex-col md:flex">
					<DashboardSidebar items={dashboardConfig.sidebarNav} />
				</aside>
				<main className="flex flex-col">{children}</main>
			</div>
		</div>
	);
}

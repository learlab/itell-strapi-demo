import { DashboardSidebar } from "@/components/nav/dashboard-sidebar";
import { DashboardNav } from "@/components/nav/dashboard-nav";
import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();
	if (!user) {
		return redirect("/auth");
	}

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
				<main className="flex w-full flex-1 flex-col">{children}</main>
			</div>
		</div>
	);
}

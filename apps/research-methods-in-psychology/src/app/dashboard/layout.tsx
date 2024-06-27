import { DashboardNav } from "@/components/nav/dashboard-nav";
import { DashboardSidebar } from "@/components/nav/dashboard-sidebar";
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
		<div className="flex min-h-screen flex-col space-y-6">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container py-4">
					<DashboardNav items={dashboardConfig.mainNav} />
				</div>
			</header>
			<div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] flex-col md:flex">
					<Suspense fallback={<DashboardSidebar.Skeleton />}>
						<DashboardSidebar />
					</Suspense>
				</aside>
				<main className="flex flex-col">
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

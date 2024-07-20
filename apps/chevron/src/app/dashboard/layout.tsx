import { SiteNav } from "@/components/site-nav";
import { SiteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/constants";
import { redirectWithSearchParams } from "@/lib/utils";
import { dashboardConfig } from "@dashboard/config";
import { DashboardNav } from "@dashboard/dashboard-nav";
import { DashboardSidebar } from "@dashboard/dashboard-sidebar";

export const generateMetadata = () => {
	const title = "Dashboard";
	const description = `Learning statistics on the ${SiteConfig.title} intelligent textbook`;
	return {
		title,
		description,
		metadataBase: new URL(env.HOST),
		openGraph: {
			title,
			description,
			type: "article",
			url: env.HOST,
			images: [
				{
					url: "/og?dashboard=true",
				},
			],
		},
	};
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await getSession();
	if (!user) {
		return redirectWithSearchParams("auth");
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
				<aside className="hidden w-[200px] flex-col md:flex border-r-2 group">
					<DashboardSidebar />
				</aside>
				<main className="flex flex-col px-4 py-4 lg:px-8 max-w-screen-xl group-has-[[data-pending]]:animate-pulse">
					{children}
				</main>
			</div>
		</div>
	);
}

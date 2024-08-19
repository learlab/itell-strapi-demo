import { SiteNav } from "@/components/site-nav";
import { SiteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/constants";
import { redirectWithSearchParams } from "@/lib/utils";
import { DashboardNav } from "@dashboard/dashboard-nav";
import { DashboardSidebar } from "@dashboard/dashboard-sidebar";
import { Elements } from "@itell/constants";

export const generateMetadata = () => {
	const title = "Dashboard";
	const description = `Learning statistics on the ${SiteConfig.title} intelligent textbook`;
	return {
		title,
		description,
		metadataBase: new URL(env.HOST),
		openGraph: {
			title: `${title} | ${SiteConfig.title}`,
			description,
			type: "article",
			url: `${env.HOST}/dashboard`,
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
					<DashboardNav />
				</SiteNav>
				<div className="p-4">
					<p>data unavailable</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<SiteNav mainContentId={Elements.DASHBOARD_MAIN}>
				<DashboardNav />
			</SiteNav>
			<main
				id={Elements.DASHBOARD_MAIN}
				className="min-h-screen grid md:grid-cols-[200px_1fr] group"
			>
				<DashboardSidebar />
				<section
					aria-label="dashboard main panel"
					className="flex flex-col px-4 py-4 lg:px-8 max-w-screen-xl group-has-[[data-pending]]:animate-pulse"
					aria-live="polite"
					aria-atomic="true"
					tabIndex={-1}
				>
					{children}
				</section>
			</main>
		</>
	);
}

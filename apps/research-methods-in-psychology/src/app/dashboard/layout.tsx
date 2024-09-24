import { getTeacherAction } from "@/actions/user";
import { ContinueReading } from "@/components/continue-reading";
import { SidebarLayout } from "@/components/sidebar";
import { SiteNav } from "@/components/site-nav";
import { SiteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import {
	ClassRole,
	Condition,
	DASHBOARD_ROLE_COOKIE,
	SIDEBAR_STATE_COOKIE,
} from "@/lib/constants";
import { redirectWithSearchParams } from "@/lib/utils";
import { DashboardNav } from "@dashboard/dashboard-nav";
import { DashboardSidebar } from "@dashboard/dashboard-sidebar";
import { Elements } from "@itell/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { cookies } from "next/headers";
import { DashboardProvider, Role } from "./_components/dashboard-context";

export const generateMetadata = () => {
	const title = "Dashboard";
	const description = `Learning statistics on the ${SiteConfig.title} intelligent textbook`;
	return {
		title,
		description,
		metadataBase: new URL(env.NEXT_PUBLIC_HOST),
		openGraph: {
			title: `${title} | ${SiteConfig.title}`,
			description,
			type: "article",
			url: `${env.NEXT_PUBLIC_HOST}/dashboard`,
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

	// if (user?.condition === Condition.SIMPLE) {
	// 	return (
	// 		<main className="flex items-center justify-center min-h-screen">
	// 			<Card className="w-80 ">
	// 				<CardHeader>
	// 					<CardTitle>data unavailable</CardTitle>
	// 				</CardHeader>
	// 				<CardContent>
	// 					<ContinueReading
	// 						text="Back to textbook"
	// 						variant="outline"
	// 						className="w-full"
	// 					/>
	// 				</CardContent>
	// 			</Card>
	// 		</main>
	// 	);
	// }

	const [teacher, _] = await getTeacherAction();
	const isTeacher = !!teacher;
	const sidebarState = cookies().get(SIDEBAR_STATE_COOKIE)?.value;
	return (
		<DashboardProvider
			defaultRole={
				(cookies().get(DASHBOARD_ROLE_COOKIE)?.value as Role) ||
				(isTeacher ? ClassRole.TEACHER : ClassRole.STUDENT)
			}
		>
			<SidebarLayout
				defaultOpen={sidebarState ? sidebarState === "true" : true}
				className="flex-col"
			>
				<DashboardSidebar isTeacher={isTeacher} />
				<SiteNav mainContentId={Elements.DASHBOARD_MAIN}>
					<DashboardNav />
				</SiteNav>
				<main id={Elements.DASHBOARD_MAIN} className="min-h-screen">
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
			</SidebarLayout>
		</DashboardProvider>
	);
}

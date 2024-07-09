import { ContinueReading } from "@/components/continue-reading";
import { SiteNav } from "@/components/site-nav";
import { getSiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/control/condition";
import { isTeacher } from "@/lib/user/teacher";
import {
	DashboardNavItem,
	DashboardNavMenu,
	SidebarItem,
	SidebarNavItem,
} from "@dashboard/_components/nav";
import { Skeleton } from "@itell/ui/server";
import {
	BarChart4Icon,
	FileEditIcon,
	MessageCircleQuestion,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await getSession();

	return (
		<div className="min-h-screen">
			<SiteNav>
				<DashboardNav items={dashboardConfig.mainNav} />
			</SiteNav>
			<div className="grid md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] flex-col md:flex border-r-2">
					<Suspense fallback={<DashboardSidebar.Skeleton />}>
						<DashboardSidebar />
					</Suspense>
				</aside>
				<main className="flex flex-col px-4 py-4 lg:px-8 max-w-screen-xl">
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

interface DashboardNavProps {
	items?: DashboardNavItem[];
	children?: React.ReactNode;
}

const DashboardNav = async (props: DashboardNavProps) => {
	const { title } = await getSiteConfig();
	const { user } = await getSession();

	return (
		<div className="flex gap-6 md:gap-10 justify-between h-16 px-8">
			<div className="flex gap-4 items-center">
				<Image
					src="/images/itell.svg"
					alt="itell logo"
					width={24}
					height={32}
					className="mr-2"
				/>
				<Link href="/" className="hidden items-center space-x-2 md:flex">
					<span className="hidden font-bold sm:inline-block">{title}</span>
				</Link>
				<ContinueReading
					text="Back to textbook"
					variant="outline"
					className="w-48 hidden md:block"
				/>
			</div>
			<DashboardNavMenu user={user} {...props} />
		</div>
	);
};

const DashboardSidebar = async () => {
	const { user } = await getSession();
	if (!user) {
		return null;
	}
	const teacher = await isTeacher(user.id);
	const items = teacher
		? dashboardConfig.sidebarNav
		: dashboardConfig.sidebarNav.filter((i) => i.title !== "Class");

	return (
		<nav className="grid items-start pt-4">
			{items.map((item) => (
				<SidebarItem key={item.title} item={item} />
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

const iconClasses = "mr-2 size-4";
const dashboardConfig: DashboardConfig = {
	mainNav: [],
	sidebarNav: [
		{
			title: "Statistics",
			href: "/dashboard",
			icon: <BarChart4Icon className={iconClasses} />,
		},
		{
			title: "Summaries",
			href: "/dashboard/summaries",
			icon: <FileEditIcon className={iconClasses} />,
		},
		{
			title: "Questions",
			href: "/dashboard/questions",
			icon: <MessageCircleQuestion className={iconClasses} />,
		},
		{
			title: "Settings",
			href: "/dashboard/settings",
			icon: <SettingsIcon className={iconClasses} />,
		},
		{
			title: "Class",
			href: "/dashboard/class",
			icon: <UsersIcon className={iconClasses} />,
		},
	],
};

type DashboardConfig = {
	mainNav: DashboardNavItem[];
	sidebarNav: SidebarNavItem[];
};

import { ContinueReading } from "@/components/continue-reading";
import { SiteNav } from "@/components/site-nav";
import { getSiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { isTeacher } from "@/lib/user/teacher";
import {
	DashboardNavItem,
	DashboardNavMenu,
	SidebarItem,
	SidebarNavItem,
} from "@dashboard//nav";
import { Skeleton } from "@itell/ui/skeleton";
import {
	BarChart4Icon,
	FileEditIcon,
	MessageCircleQuestion,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<SiteNav>
				<DashboardNav items={dashboardConfig.mainNav} />
			</SiteNav>
			<main className="min-h-screen grid md:grid-cols-[200px_1fr] group">
				<DashboardSidebar />
				<div
					aria-label="dashboard main panel"
					className="flex flex-col px-4 py-4 lg:px-8 max-w-screen-xl group-has-[[data-pending]]:animate-pulse"
				>
					{children}
				</div>
			</main>
		</>
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
		<div className="flex gap-6 md:gap-10 justify-between h-[var(--nav-height)] px-8">
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
		<nav className="hidden md:grid items-start pt-4 border-r-2">
			<ol>
				{items.map((item) => (
					<li key={item.title}>
						<SidebarItem item={item} />
					</li>
				))}
			</ol>
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

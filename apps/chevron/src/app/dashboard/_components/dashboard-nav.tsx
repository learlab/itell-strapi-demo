import { ContinueReading } from "@/components/continue-reading";
import { getSiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import {
	DashboardNavItem,
	DashboardNavMenu,
	SidebarItem,
	SidebarNavItem,
} from "@dashboard/nav";
import {
	BarChart4Icon,
	FileEditIcon,
	MessageCircleQuestion,
	SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DashboardNavProps {
	items?: DashboardNavItem[];
	children?: React.ReactNode;
}

export const DashboardNav = async (props: DashboardNavProps) => {
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

export const DashboardSidebar = () => {
	return (
		<nav className="grid items-start pt-4">
			{dashboardConfig.sidebarNav.map((item) => (
				<SidebarItem key={item.title} item={item} />
			))}
		</nav>
	);
};

const iconClasses = "mr-2 size-4";
export const dashboardConfig: DashboardConfig = {
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
	],
};

type DashboardConfig = {
	mainNav: DashboardNavItem[];
	sidebarNav: SidebarNavItem[];
};

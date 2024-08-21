import { MobileNavItem } from "@/components/mobile-nav";
import {
	BarChart4Icon,
	FileEditIcon,
	MessageCircleQuestion,
	SettingsIcon,
} from "lucide-react";

const iconClasses = "size-4";
export const dashboardConfig: DashboardConfig = {
	mobileNav: [
		{
			title: "Summaries",
			href: "/dashboard/summaries",
		},
		{
			title: "Questions",
			href: "/dashboard/questions",
		},
		{
			title: "Settings",
			href: "/dashboard/settings",
		},
	],
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

export type DashboardNavItem = {
	title: string;
	href: string;
	disabled?: boolean;
};

export type SidebarNavItem = {
	title: string;
	href: string;
	external?: boolean;
	icon?: React.ReactNode;
};

export type DashboardConfig = {
	mobileNav: MobileNavItem[];
	sidebarNav: SidebarNavItem[];
};

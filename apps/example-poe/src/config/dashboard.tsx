import { DashboardConfig } from "@/types/config";
import {
	BarChart4Icon,
	FileEditIcon,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";

const iconClasses = "mr-2 h-4 w-4";

const links = [
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
		title: "Settings",
		href: "/dashboard/settings",
		icon: <SettingsIcon className={iconClasses} />,
	},
	{
		title: "Class",
		href: "/dashboard/class",
		icon: <UsersIcon className={iconClasses} />,
	},
];

export const dashboardConfig: DashboardConfig = {
	mainNav: links,
	sidebarNav: links,
};

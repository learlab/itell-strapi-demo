import { DashboardConfig } from "@/types/config";
import {
	BarChart4Icon,
	FileEditIcon,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";

const iconClasses = "mr-2 h-4 w-4";

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

import { DashboardConfig } from "@/types/config";
import {
	BarChart4Icon,
	FileEditIcon,
	MessageCircleQuestion,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";

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
		{
			title: "Class",
			href: "/dashboard/class",
			icon: <UsersIcon className={iconClasses} />,
		},
	],
};

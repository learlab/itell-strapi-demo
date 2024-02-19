import { allPagesSorted } from "@/lib/pages";

export const CommandMenuConfig = {
	textbookPages: allPagesSorted.map((s) => {
		return {
			title: `${s.location.chapter}.${s.location.section} ${s.title}`,
			href: s.url,
		};
	}),
	tools: [
		{
			title: "Dashboard",
			href: "/dashboard",
			description: "View your learning statistics",
		},
		{
			title: "Summaries",
			href: "/dashboard/summaries",
			description: "Manage your summaries",
		},
		{
			title: "Settings",
			href: "/dashboard/settings",
			description: "Configure personal settings",
		},
		{
			title: "Class",
			href: "/dashboard/class",
			description: "Monitor student progress",
		},
		{
			title: "Guide",
			href: "/guide",
			description: "Learn how to use the textbook",
		},
	],
};

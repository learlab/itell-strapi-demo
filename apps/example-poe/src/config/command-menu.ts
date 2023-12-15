import { allChaptersSorted } from "@/lib/chapters";
import { makeChapterHref } from "@/lib/utils";

export const CommandMenuConfig = {
	textbookPages: allChaptersSorted.map((c) => {
		return {
			title: `${c.chapter}. ${c.title}`,
			href: makeChapterHref(c.chapter),
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

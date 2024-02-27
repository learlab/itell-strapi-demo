"use client";

import { ActivePage, Chapter } from "@/types/section";
import { cn } from "@itell/core/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./client-components";

type ModuleSidebarProps = {
	chapters: Chapter[];
	currentPage: ActivePage;
};

export function ModuleSidebar({ chapters, currentPage }: ModuleSidebarProps) {
	const [activePage, setActivePage] = useState(currentPage);
	const router = useRouter();

	const navigatePage = (page: ActivePage) => {
		setActivePage(page);
		router.push(page.url);
	};

	return (
		<nav className="space-y-1">
			{chapters.map((chapter) => (
				<Collapsible
					key={chapter.chapter}
					defaultOpen={chapter.chapter === activePage.chapter}
					className="list-none"
				>
					<CollapsibleTrigger asChild>
						<Button
							variant="ghost"
							className={cn(
								"p-2 block w-full leading-relaxed text-pretty text-left h-fit text-[1.08rem] mb-2",
								{
									"bg-accent": chapter.chapter === activePage.chapter,
								},
							)}
							disabled={!chapter.visible}
						>
							<Link href={chapter.url}>
								{chapter.title} {chapter.visible ? "" : "🔒"}
							</Link>
						</Button>
					</CollapsibleTrigger>

					<CollapsibleContent className="space-y-2">
						{chapter.sections.map((section, index) => (
							<li
								className={cn(
									"px-2 py-1 transition ease-in-out duration-200 relative rounded-md hover:bg-accent",
									{
										"bg-accent": section.url === activePage.url,
									},
								)}
								key={section.url}
							>
								<Button
									variant={"ghost"}
									disabled={!section.visible}
									onClick={() =>
										navigatePage({
											chapter: chapter.chapter,
											section: section.section,
											url: section.url,
										})
									}
									className="p-0 block text-left font-light text-pretty h-fit"
								>
									{`${index + 1}. ${section.title}`}{" "}
									{section.visible ? "" : "🔒"}
								</Button>
							</li>
						))}
					</CollapsibleContent>
				</Collapsible>
			))}
		</nav>
	);
}

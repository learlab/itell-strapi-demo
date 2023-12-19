"use client";

import { ActivePage, Chapter, SidebarSection } from "@/types/section";
import Balancer from "react-wrap-balancer";
import { cn } from "@itell/core/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./client-components";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { makePageHref } from "@/lib/utils";

type ModuleSidebarProps = {
	chapters: Chapter[];
	currentPage: ActivePage;
};

export function ModuleSidebar({ chapters, currentPage }: ModuleSidebarProps) {
	const [activePage, setActivePage] = useState(currentPage);
	const router = useRouter();

	const navigatePage = (page: ActivePage) => {
		console.log(page);
		setActivePage(page);
		router.push(page.url);
	};

	return (
		<nav className="space-y-1">
			{chapters.map((chapter) => (
				<Collapsible
					key={chapter.chapter}
					open={chapter.chapter === activePage.chapter}
					className="list-none"
				>
					<CollapsibleTrigger className="px-1 gap-0">
						<div
							className={cn("relative hover:bg-accent rounded-md mb-2", {
								"bg-accent": chapter.chapter === activePage.chapter,
							})}
						>
							<Link href={chapter.url} className="block mb-1 p-1">
								<h5 className="font-semibold leading-relaxed">
									<Balancer as="div">{chapter.title}</Balancer>
								</h5>
							</Link>
						</div>
					</CollapsibleTrigger>

					<CollapsibleContent>
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
								<button
									type="button"
									onClick={() =>
										navigatePage({
											chapter: chapter.chapter,
											section: section.section,
											url: section.url,
										})
									}
								>
									<p className="text-sm font-light text-left">
										<Balancer>{`${index + 1}. ${section.title}`}</Balancer>
									</p>
								</button>
							</li>
						))}
					</CollapsibleContent>
				</Collapsible>
			))}
		</nav>
	);
}

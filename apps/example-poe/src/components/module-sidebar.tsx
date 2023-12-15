"use client";

import { Chapter } from "@/types/section";
import Balancer from "react-wrap-balancer";
import { cn } from "@itell/core/utils";
import { SectionLocation } from "@/types/location";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./client-components";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { makeLocationHref } from "@/lib/utils";

type ModuleSidebarProps = {
	chapters: Chapter[];
	currentLocation: SectionLocation;
};

export function ModuleSidebar({
	chapters,
	currentLocation,
}: ModuleSidebarProps) {
	const [activeLocation, setActiveLocation] = useState(currentLocation);
	const router = useRouter();

	const navigatePage = (location: {
		module: number;
		chapter: number;
		section: number;
	}) => {
		setActiveLocation(location);
		router.push(makeLocationHref(location), {});
	};

	return (
		<nav className="space-y-1">
			{chapters.map((chapter) => (
				<Collapsible
					key={chapter.chapter}
					open={chapter.chapter === currentLocation.chapter}
					className="list-none"
				>
					<CollapsibleTrigger className="px-1 gap-0">
						<div
							className={cn("relative hover:bg-accent rounded-md mb-2", {
								"bg-accent":
									activeLocation.chapter === chapter.chapter &&
									activeLocation.section === 0,
							})}
						>
							<Link href={`/${chapter.url}`} className="block mb-1 p-1">
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
										"bg-accent":
											section.chapter === activeLocation.chapter &&
											section.section === activeLocation.section,
									},
								)}
								key={section.url}
							>
								<button
									type="button"
									onClick={() =>
										navigatePage({
											module: section.module,
											chapter: section.chapter,
											section: section.section || 0,
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

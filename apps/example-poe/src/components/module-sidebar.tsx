import { Chapter } from "@/types/section";
import Balancer from "react-wrap-balancer";
import { cn } from "@itell/core/utils";
import { SectionLocation } from "@/types/location";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./client-components";

type ModuleSidebarProps = {
	chapters: Chapter[];
	currentLocation: SectionLocation;
};

export function ModuleSidebar({
	chapters,
	currentLocation,
}: ModuleSidebarProps) {
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
									chapter.chapter === currentLocation.chapter &&
									currentLocation.section === 0,
							})}
						>
							<a href={`/${chapter.url}`} className="block mb-1 p-1">
								<h5 className="font-semibold leading-relaxed">
									<Balancer as="div">{chapter.title}</Balancer>
								</h5>
							</a>
						</div>
					</CollapsibleTrigger>

					<CollapsibleContent>
						{chapter.sections.map((section, index) => (
							<li
								className={cn(
									"px-2 py-1 transition ease-in-out duration-200 relative rounded-md hover:bg-accent",
									{
										"bg-accent":
											section.chapter === currentLocation.chapter &&
											section.section === currentLocation.section,
									},
								)}
								key={section.url}
							>
								<a href={`/${section.url}`}>
									<p className="text-sm font-light">
										<Balancer>{`${index + 1}. ${section.title}`}</Balancer>
									</p>
								</a>
							</li>
						))}
					</CollapsibleContent>
				</Collapsible>
			))}
		</nav>
	);
}

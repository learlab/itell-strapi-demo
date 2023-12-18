"use client";

import { cn, groupby, keyof } from "@itell/core/utils";
import Link from "next/link";
import { useLocation } from "@/lib/hooks/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import React, { useState } from "react";
import { allSectionsSorted } from "@/lib/sections";
import UserAvatar from "../user-avatar";
import ThemeToggle from "../theme/theme-toggle";
import { MenuIcon, XIcon } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { CommandMenu } from "../command-menu";
import { UserAccountNav } from "../user-account-nav";

const moduleChapters = groupby(
	allSectionsSorted.filter((section) => section.location.section === 0),
	(section) => section.location.module,
	(section) => ({
		title: section.title,
		chapter: section.location.chapter,
		url: `/module-${section.location.module}/chapter-${section.location.chapter}`,
	}),
);
const modules = keyof(moduleChapters);

const ChapterItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ChapterItem.displayName = "ChapterItem";

export default function TextbookNavMenu() {
	const location = useLocation();
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

	const moduleTriggers = modules.map((module) => {
		const firstChapter = moduleChapters[module][0].chapter;
		return {
			module,
			active: location && location.module === Number(module),
			url: `/module-${module}/chapter-${firstChapter}`,
		};
	});

	return (
		<>
			<NavigationMenu className="hidden md:flex w-full px-8 lg:px-4 py-2">
				<NavigationMenuList>
					{moduleTriggers.map(({ module, active, url }) => {
						return (
							<NavigationMenuItem key={module}>
								<NavigationMenuTrigger
									className={cn({
										"bg-accent": active,
									})}
								>
									<Link href={url}>Module {module}</Link>
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
										{moduleChapters[module].map((chapter) => (
											<ChapterItem
												key={chapter.title}
												title={`Chapter ${chapter.chapter}`}
												href={chapter.url}
											>
												{chapter.title}
											</ChapterItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						);
					})}
				</NavigationMenuList>
				<div className="ml-auto flex items-center gap-2">
					<CommandMenu />
					<ThemeToggle />
					<UserAccountNav />
				</div>
			</NavigationMenu>
			<div className="flex w-full items-center justify-between space-x-2 md:hidden">
				<button
					className="flex items-center gap-2"
					onClick={() => setShowMobileMenu(!showMobileMenu)}
				>
					{showMobileMenu ? <XIcon /> : <MenuIcon />}
					<span className="font-bold">Menu</span>
				</button>
				{showMobileMenu && (
					<MobileNav
						items={moduleTriggers.map((m) => ({
							title: `Module ${m.module}`,
							href: m.url,
						}))}
					/>
				)}
				<UserAccountNav />
			</div>
		</>
	);
}

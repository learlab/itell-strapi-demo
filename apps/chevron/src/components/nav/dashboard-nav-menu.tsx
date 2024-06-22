"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

import { MobileNav } from "@/components/nav/mobile-nav";
import { DashboardNavItem } from "@/config/dashboard";
import { cn } from "@itell/core/utils";
import { User } from "lucia";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { CommandMenu } from "../command-menu";
import ThemeToggle from "../theme/theme-toggle";
import { UserAccountNav } from "../user-account-nav";

interface Props {
	user: User | null;
	items?: DashboardNavItem[];
	children?: React.ReactNode;
}

export function DashboardNavMenu({ user, items, children }: Props) {
	const segment = useSelectedLayoutSegment();
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

	if (!user) {
		return null;
	}

	return (
		<div className="flex items-center justify-between flex-1 md:flex-initial">
			{items?.length ? (
				<nav className="hidden gap-6 md:flex">
					{items?.map((item) => (
						<Link
							key={item.href}
							href={item.disabled ? "#" : item.href}
							className={cn(
								"flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
								item.href.startsWith(`/${segment}`)
									? "text-foreground"
									: "text-foreground/60",
								item.disabled && "cursor-not-allowed opacity-80",
							)}
						>
							{item.title}
						</Link>
					))}
				</nav>
			) : null}
			<button
				className="flex items-center space-x-2 md:hidden"
				onClick={() => setShowMobileMenu(!showMobileMenu)}
			>
				{showMobileMenu ? <XIcon /> : <MenuIcon />}
				<span className="font-bold">Menu</span>
			</button>
			{showMobileMenu && items && (
				<MobileNav items={items}>{children}</MobileNav>
			)}
			<div className="hidden sm:flex items-center gap-2">
				<CommandMenu />
				<ThemeToggle />
				<UserAccountNav />
			</div>
		</div>
	);
}

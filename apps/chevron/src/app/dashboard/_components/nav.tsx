"use client";

import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { useLockBody } from "@itell/core/hooks";
import { cn } from "@itell/core/utils";
import { User } from "lucia";
import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";
import { DashboardNavItem } from "./config";

export const DashboardNavMenu = ({
	user,
	items,
	children,
}: {
	user: User | null;
	items?: DashboardNavItem[];
	children?: React.ReactNode;
}) => {
	const segment = useSelectedLayoutSegment();
	const [showMobileMenu, setShowMobileMenu] = useState(false);

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
				type="button"
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
				<UserAccountNav user={user} />
			</div>
		</div>
	);
};

const MobileNav = ({
	items,
	children,
}: {
	items: DashboardNavItem[];
	children?: React.ReactNode;
}) => {
	useLockBody();

	return (
		<div
			className={cn(
				"fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
			)}
		>
			<div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
				<div className="border-b-2">
					<TopLink href="/" text="Home" />
					<TopLink href="/dashboard" text="Dashboard" />
				</div>
				<nav className="grid grid-flow-row auto-rows-max text-sm">
					{items.map((item) => (
						<Link
							key={item.href}
							href={item.disabled ? "#" : item.href}
							className={cn(
								"flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
								item.disabled && "cursor-not-allowed opacity-60",
							)}
						>
							{item.title}
						</Link>
					))}
				</nav>
				{children}
			</div>
		</div>
	);
};

const TopLink = ({ href, text }: { href: string; text: string }) => {
	return (
		<Link
			href={href}
			className="flex w-full items-center rounded-md p-2 text-sm font-medium"
		>
			<span className="font-bold">{text}</span>
		</Link>
	);
};

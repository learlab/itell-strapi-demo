import React from "react";
import Link from "next/link";

import { cn } from "@itell/core/utils";
import { useLockBody } from "@itell/core/hooks";
import { DashboardNavItem } from "@/types/nav";

// had to accept title as a prop here
// because MobileNav is imported by DashboardNavMenu (client component)
// and cannot be a server component
interface MobileNavProps {
	items: DashboardNavItem[];
	children?: React.ReactNode;
}

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

export function MobileNav({ items, children }: MobileNavProps) {
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
					{items.map((item, index) => (
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
}

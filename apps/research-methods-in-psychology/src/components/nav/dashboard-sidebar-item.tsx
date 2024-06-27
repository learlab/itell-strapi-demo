"use client";

import { cn } from "@itell/core/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarNavItem = {
	title: string;
	href: string;
	disabled?: boolean;
	external?: boolean;
	icon?: React.ReactNode;
};

type Props = {
	item: SidebarNavItem;
};

export const DashboardSidebarItem = ({ item }: Props) => {
	const path = usePathname();

	return (
		<Link href={item.disabled ? "/" : item.href}>
			<span
				className={cn(
					"group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
					path === item.href ? "bg-accent" : "transparent",
					item.disabled && "cursor-not-allowed opacity-80",
				)}
			>
				{item.icon || <ArrowRightIcon className="mr-2 size-4" />}
				<span>{item.title}</span>
			</span>
		</Link>
	);
};

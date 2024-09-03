"use client";

import { useSidebar } from "@/components/sidebar";
import { cn } from "@itell/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { dashboardConfig } from "./config";

export const NavStatistics = () => {
	const { role } = useSidebar();
	const [pending, startTransition] = useTransition();
	const pathname = usePathname();
	const [activeRoute, setActiveRoute] = useOptimistic(pathname);
	const router = useRouter();

	return (
		<ul className="grid" data-pending={pending ? "" : undefined}>
			{dashboardConfig.sidebarNav[role].map((item) => (
				<li key={item.title}>
					<Link
						className={cn(
							"flex h-9 items-center gap-2.5 overflow-hidden px-1.5 text-sm lg:text-base outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2",
							activeRoute === item.href && "bg-accent text-accent-foreground",
						)}
						href={item.href}
						onClick={(event) => {
							event.preventDefault();
							setActiveRoute(item.href);
							startTransition(() => {
								router.push(item.href);
							});
						}}
					>
						<item.icon className="h-4 w-4 shrink-0 translate-x-0.5 text-muted-foreground" />
						<div className="line-clamp-1 grow overflow-hidden pr-6 font-medium">
							{item.title}
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
};

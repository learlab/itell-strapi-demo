"use client";

import { cn } from "@itell/core/utils";
import { ArrowRightIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { dashboardConfig } from "./config";

export const DashboardSidebar = () => {
	const [pending, startTransition] = useTransition();
	const pathname = usePathname();
	const [activeRoute, setActiveRoute] = useOptimistic(pathname);
	const router = useRouter();

	return (
		<nav className="grid items-start pt-4" data-pending={pending}>
			{dashboardConfig.sidebarNav.map((item) => (
				<button
					type="button"
					disabled={item.disabled}
					onClick={() => {
						setActiveRoute(item.href);
						startTransition(() => {
							router.push(item.href);
						});
					}}
					key={item.title}
				>
					<span
						className={cn(
							"group flex items-center gap-2 px-6 h-12 text-sm lg:text-base font-medium hover:bg-accent hover:text-accent-foreground",
							activeRoute === item.href ? "bg-accent" : "transparent",
							item.disabled && "cursor-not-allowed opacity-80",
						)}
					>
						{item.icon || <ArrowRightIcon className="size-4" />}
						{item.title}
					</span>
				</button>
			))}
		</nav>
	);
};

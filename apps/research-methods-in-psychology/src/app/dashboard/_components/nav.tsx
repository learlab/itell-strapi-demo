"use client";

import { CommandMenu } from "@/components/command-menu";
import { MobileNav } from "@/components/mobile-nav";
import { useSidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { User } from "lucia";
import { dashboardConfig } from "./config";

export const DashboardNavMenu = ({
	user,
}: {
	user: User;
}) => {
	const { role } = useSidebar();
	return (
		<div className="flex items-center justify-between flex-1 md:flex-initial">
			<MobileNav items={dashboardConfig.mobileNav[role]} />
			<div className="hidden sm:flex items-center gap-2">
				<CommandMenu />
				<ThemeToggle />
				<UserAccountNav user={user} />
			</div>
		</div>
	);
};

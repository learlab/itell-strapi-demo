"use client";

import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { User } from "lucia";
import { dashboardConfig } from "./config";
import { useDashboard } from "./dashboard-context";

export const DashboardNavMenu = ({
	user,
}: {
	user: User;
}) => {
	const { role } = useDashboard();
	return (
		<div className="flex items-center justify-between flex-1 md:flex-initial">
			<MobileNav items={dashboardConfig.mobileNav[role]} />
			<div className="hidden sm:flex items-center gap-2">
				<ThemeToggle />
				<UserAccountNav user={user} />
			</div>
		</div>
	);
};

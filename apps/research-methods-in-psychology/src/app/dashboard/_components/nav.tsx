"use client";

import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { User } from "lucia";

import { dashboardConfig } from "./config";
import { useDashboard } from "./dashboard-context";

export const DashboardNavMenu = ({ user }: { user: User }) => {
  const { role } = useDashboard();
  return (
    <div className="flex flex-1 items-center justify-between md:flex-initial">
      <MobileNav items={dashboardConfig.mobileNav[role]} />
      <div className="hidden items-center gap-2 sm:flex">
        <ThemeToggle />
        <UserAccountNav user={user} />
      </div>
    </div>
  );
};

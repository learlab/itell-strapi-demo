import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/sidebar";

import { NavStatistics } from "./nav-statistics";
import { RoleSwitcher } from "./role-switch";

export function DashboardSidebar({ isTeacher }: { isTeacher: boolean }) {
  return (
    <Sidebar>
      <SidebarContent className="gap-2">
        {isTeacher ? (
          <SidebarHeader>
            <RoleSwitcher />
          </SidebarHeader>
        ) : null}
        <SidebarItem>
          <SidebarLabel>Statistics</SidebarLabel>
          <NavStatistics />
        </SidebarItem>
      </SidebarContent>
      {/* <SidebarFooter>
				<SidebarTrigger className="flex items-center gap-2 w-full" />
			</SidebarFooter> */}
    </Sidebar>
  );
}

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarItem,
	SidebarLabel,
} from "@/components/sidebar";
import { NavStatistics } from "./nav-statistics";
import { RoleSwitcher } from "./role-switch";

export const DashboardSidebar = async ({
	isTeacher,
}: { isTeacher: boolean }) => {
	return (
		<Sidebar>
			<SidebarContent className="gap-2">
				{isTeacher && (
					<SidebarHeader>
						<RoleSwitcher />
					</SidebarHeader>
				)}
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
};

import { ContinueReading } from "@/components/continue-reading";
import { SidebarTrigger } from "@/components/sidebar";
import { getSession } from "@/lib/auth";
import { DashboardNavMenu } from "@dashboard/nav";

export const DashboardNav = async () => {
	const { user } = await getSession();

	return (
		<div className="flex gap-4 md:gap-10 justify-between h-[var(--nav-height)] px-6">
			<div className="flex gap-4 items-center">
				<ContinueReading
					text="Back to textbook"
					variant="outline"
					className="hidden md:block"
				/>
				<SidebarTrigger />
			</div>
			{user && <DashboardNavMenu user={user} />}
		</div>
	);
};

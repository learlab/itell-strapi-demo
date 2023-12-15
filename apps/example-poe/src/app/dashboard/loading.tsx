import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/shell";
import { DashboardBadge, Skeleton } from "@itell/ui/server";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Learning Statistics"
				text="Understand your learning journey"
			/>
			<div className="space-y-4">
				<Skeleton className="w-96 h-8" />
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<DashboardBadge.Skeletons />
				</div>
				<div>
					<Skeleton className="w-96 h-12" />
				</div>
				<Skeleton className="w-full h-[350px]" />
			</div>
		</DashboardShell>
	);
}

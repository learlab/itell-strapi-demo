import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/shell";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	DashboardBadge,
	Skeleton,
} from "@itell/ui/server";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader heading="Student Details" />
			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex items-center justify-between">
							<Skeleton className="w-24" />
							<Skeleton className="w-40" />
						</div>
					</CardTitle>
					<CardDescription>
						<div className="flex items-center justify-between">
							<Skeleton className="w-40" />
							<Skeleton className="w-64" />
						</div>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<DashboardBadge.Skeletons />
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
							<Skeleton className="col-span-4 h-[350px]" />
							<Skeleton className="col-span-3 h-[350px]" />
						</div>
					</div>
				</CardContent>
			</Card>
		</DashboardShell>
	);
}

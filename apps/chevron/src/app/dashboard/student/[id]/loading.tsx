import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { UserDetails } from "@/components/dashboard/user/user-details";
import { DashboardShell } from "@/components/page/shell";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
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
					<div className="flex items-center justify-between">
						<Skeleton className="w-40" />
						<Skeleton className="w-64" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<UserDetails.Skeleton />
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

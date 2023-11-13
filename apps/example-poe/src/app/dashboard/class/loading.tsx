import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TeacherBadges } from "@/components/dashboard/teacher/teacher-badges";
import { DashboardShell } from "@/components/shell";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Skeleton,
} from "@itell/ui/server";

export default function DashboardSettingsLoading() {
	return (
		<DashboardShell>
			<DashboardHeader heading="Class" text="Manage class registration" />
			<Card>
				<CardHeader>
					<CardTitle>Manage Your Class</CardTitle>
					<CardDescription>View students' progress</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<h3 className="mb-4 text-lg font-medium">Average Class Statistics</h3>
					<TeacherBadges.Skeleton />

					<h3 className="mb-4 text-lg font-medium">Average Class Progress</h3>
					<Skeleton className="w-96 h-8" />

					<h3 className="mb-4 text-lg font-medium">All Students</h3>

					<div className="flex items-center py-4 justify-between">
						<Skeleton className="rounded-md h-12 w-64" />
						<Skeleton className="rounded-md h-12 w-40 " />
					</div>

					<Skeleton className="rounded-md h-[300px]" />
					<div className="flex items-center justify-end space-x-2 py-4">
						<Skeleton className="rounded-md h-12 w-28" />
						<Skeleton className="rounded-md h-12 w-16" />
					</div>
				</CardContent>
			</Card>
		</DashboardShell>
	);
}

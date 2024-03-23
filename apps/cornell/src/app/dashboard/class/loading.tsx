import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TeacherBadges } from "@/components/dashboard/teacher/teacher-badges";
import { TeacherClassGeneral } from "@/components/dashboard/teacher/teacher-class-general";
import { DashboardShell } from "@/components/page/shell";
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
			<DashboardHeader
				heading="Manage Your Class"
				text="View students' progress"
			/>
			<Card>
				<CardHeader>
					<CardTitle>Your Class</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<h3 className="mb-4 text-lg font-medium">Average Class Statistics</h3>
					<TeacherBadges.Skeleton />
					<TeacherClassGeneral.Skeleton />
				</CardContent>
			</Card>
		</DashboardShell>
	);
}

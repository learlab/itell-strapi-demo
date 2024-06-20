import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TeacherClass } from "@/components/dashboard/teacher/teacher-class";
import { DashboardShell } from "@/components/page/shell";

export default function DashboardSettingsLoading() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Manage Your Class"
				text="View students' progress"
			/>
			<TeacherClass.Skeleton />
		</DashboardShell>
	);
}

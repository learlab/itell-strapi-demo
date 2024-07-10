import { ClassInfo } from "@class/class-info";
import { DashboardHeader, DashboardShell } from "@dashboard//shell";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Manage Your Class"
				text="View students' progress"
			/>
			<ClassInfo.Skeleton />
		</DashboardShell>
	);
}

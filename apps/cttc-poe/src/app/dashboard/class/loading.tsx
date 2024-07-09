import { DashboardHeader, DashboardShell } from "@dashboard/_components/shell";
import { ClassInfo } from "./_components/class-info";

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

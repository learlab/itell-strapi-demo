import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { ClassInfo } from "./_components/class-info";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.class.title}
				text={Meta.class.description}
			/>
			<ClassInfo.Skeleton />
		</DashboardShell>
	);
}

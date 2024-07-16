import { ClassInfo } from "@/app/dashboard/(home)/@teacher/_components/class-info";
import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";

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

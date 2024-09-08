import { incrementViewAction } from "@/actions/dashboard";
import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { ErrorBoundary } from "react-error-boundary";
import { checkTeacher } from "../check-teacher";
import { ClassInfo } from "./_components/class-info";

export default async function () {
	const teacher = await checkTeacher();
	incrementViewAction({ pageSlug: Meta.homeTeacher.slug });

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.homeTeacher.title}
				text={Meta.homeTeacher.description}
			/>
			<ErrorBoundary fallback={<ClassInfo.ErrorFallback />}>
				<ClassInfo classId={teacher.classId} />
			</ErrorBoundary>
		</DashboardShell>
	);
}

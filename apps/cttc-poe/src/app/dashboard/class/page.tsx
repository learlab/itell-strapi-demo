import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TeacherClass } from "@/components/dashboard/teacher/teacher-class";
import { DashboardShell } from "@/components/page/shell";
import { Meta } from "@/config/metadata";
import { getSessionUser } from "@/lib/auth";
import { getUserTeacherStatus } from "@/lib/dashboard";
import { Errorbox } from "@itell/ui/server";
import { redirect } from "next/navigation";

export const metadata = Meta.class;

export default async function () {
	const user = await getSessionUser();

	if (!user) {
		return redirect("/auth");
	}

	const teacher = await getUserTeacherStatus(user.id);

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.class.title}
				text={Meta.class.description}
			/>
			{teacher ? (
				<TeacherClass classId={teacher.classId} />
			) : (
				<Errorbox>You have to be a teacher to view this page</Errorbox>
			)}
		</DashboardShell>
	);
}

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TeacherClass } from "@/components/dashboard/teacher/teacher-class";
import { DashboardShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Errorbox } from "@itell/ui/server";
import { getUserTeacherStatus } from "@/lib/dashboard";

const title = "Manage Your Class";
const description = "View students' progress";

export const metadata: Metadata = {
	title,
	description,
};

export default async function () {
	const user = await getCurrentUser();

	if (!user) {
		return redirect("/auth");
	}

	const teacher = await getUserTeacherStatus(user.id);

	return (
		<DashboardShell>
			<DashboardHeader heading={title} text={description} />
			{teacher ? (
				<TeacherClass classId={teacher.classId} />
			) : (
				<Errorbox>You have to be a teacher to view this page</Errorbox>
			)}
		</DashboardShell>
	);
}

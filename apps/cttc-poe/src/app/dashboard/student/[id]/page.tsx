import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StudentProfile } from "@/components/dashboard/student/student-profile";
import { DashboardShell } from "@/components/page/shell";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { getUserTeacherStatus } from "@/lib/dashboard";
import { routes } from "@/lib/navigation";
import { getUser } from "@/lib/user";
import { Errorbox } from "@itell/ui/server";
import { redirect } from "next/navigation";

export const metadata = Meta.student;

interface PageProps {
	params: unknown;
	searchParams?: unknown;
}

export default async function ({ params, searchParams }: PageProps) {
	const { user } = await getSession();

	if (!user) {
		return redirect("/auth");
	}

	const teacher = await getUserTeacherStatus(user.id);

	if (!teacher) {
		return (
			<DashboardShell>
				<DashboardHeader
					heading={Meta.student.title}
					text={Meta.student.description}
				/>
				<Errorbox>You have to be a teacher to view this page.</Errorbox>
			</DashboardShell>
		);
	}

	const { id } = routes.student.$parseParams(params);
	const student = await getUser(id);
	if (!student) {
		return (
			<DashboardShell>
				<DashboardHeader
					heading={Meta.student.title}
					text={Meta.student.description}
				/>
				<Errorbox>The student does not exist in your class</Errorbox>
			</DashboardShell>
		);
	}

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.student.title}
				text={Meta.student.description}
			/>
			<StudentProfile student={student} searchParams={searchParams} />
		</DashboardShell>
	);
}

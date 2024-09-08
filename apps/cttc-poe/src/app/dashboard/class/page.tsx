import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { getUserTeacherStatus } from "@/lib/dashboard";
import { ClassInfo } from "@class/class-info";
import { DashboardHeader, DashboardShell } from "@dashboard//shell";
import { Errorbox } from "@itell/ui/callout";
import { redirect } from "next/navigation";

export const metadata = Meta.class;

export default async function () {
	const { user } = await getSession();

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
				<ClassInfo classId={teacher.classId} />
			) : (
				<Errorbox>You have to be a teacher to view this page</Errorbox>
			)}
		</DashboardShell>
	);
}

import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { getUserTeacherStatus } from "@/lib/dashboard";
import { DashboardHeader, DashboardShell } from "@dashboard/_components/shell";
import { Errorbox } from "@itell/ui/server";
import { redirect } from "next/navigation";
import { ClassInfo } from "./_components/class-info";

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

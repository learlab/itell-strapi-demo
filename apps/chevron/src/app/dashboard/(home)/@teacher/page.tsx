import { getTeacherAction } from "@/actions/user";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { delay } from "@/lib/utils";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { Errorbox } from "@itell/ui/server";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { ClassInfo } from "./_components/class-info";

export const metadata = Meta.class;

export default async function () {
	const { user } = await getSession();

	if (!user) {
		return redirect("/auth");
	}

	const [teacher, err] = await getTeacherAction({ userId: user.id });
	if (err) {
		throw new Error(err.message);
	}

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.class.title}
				text={Meta.class.description}
			/>
			{teacher ? (
				<ErrorBoundary fallback={<ClassInfo.ErrorFallback />}>
					<ClassInfo classId={teacher.classId} />
				</ErrorBoundary>
			) : (
				<Errorbox>You have to be a teacher to view this page</Errorbox>
			)}
		</DashboardShell>
	);
}

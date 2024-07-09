import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { getTeacherWithClassId, incrementView } from "@/lib/dashboard/actions";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { JoinClassModal } from "@dashboard/_components/join-class-modal";
import { DashboardHeader, DashboardShell } from "@dashboard/_components/shell";
import { Settings } from "./_components/settings";

export const metadata = Meta.settings;

type Props = {
	searchParams?: Record<string, string>;
};

export default async function ({ searchParams }: Props) {
	const { user } = await getSession();
	const classId =
		routes.settings.$parseSearchParams(searchParams).join_class_code;

	if (!user) {
		return redirectWithSearchParams("auth", searchParams);
	}
	incrementView(user.id, "settings", searchParams);

	const teacher = classId ? await getTeacherWithClassId(classId) : null;

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.settings.title}
				text={Meta.settings.description}
			/>
			<Settings user={user} />
			{classId && teacher && (
				<JoinClassModal
					userId={user.id}
					userClassId={user.classId}
					teacher={teacher}
					classId={classId}
				/>
			)}
		</DashboardShell>
	);
}

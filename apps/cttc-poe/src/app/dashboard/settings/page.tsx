import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { ClassInviteModal } from "@/components/dashboard/settings/class-invite-modal";
import { DashboardShell } from "@/components/page/shell";
import { Meta } from "@/config/metadata";
import { getSessionUser } from "@/lib/auth";
import { getTeacherWithClassId, incrementView } from "@/lib/dashboard/actions";
import { getUser } from "@/lib/user";
import { redirectWithSearchParams } from "@/lib/utils";

export const metadata = Meta.settings;

type Props = {
	searchParams?: Record<string, string>;
};

export default async function ({ searchParams }: Props) {
	const currentUser = await getSessionUser();
	const classId = searchParams?.join_class_code;

	if (!currentUser) {
		return redirectWithSearchParams("auth", searchParams);
	}

	const user = await getUser(currentUser.id);
	if (!user) {
		return redirectWithSearchParams("auth", searchParams);
	}

	incrementView("settings");

	const teacher = classId ? await getTeacherWithClassId(classId) : null;

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.settings.title}
				text={Meta.settings.description}
			/>
			<SettingsForm user={user} />
			{classId && teacher && (
				<ClassInviteModal
					userId={user.id}
					userClassId={user.classId}
					teacherToJoin={teacher}
					classId={classId}
				/>
			)}
		</DashboardShell>
	);
}

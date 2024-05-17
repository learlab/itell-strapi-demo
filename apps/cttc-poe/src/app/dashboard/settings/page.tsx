import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { ClassInviteModal } from "@/components/dashboard/settings/class-invite-modal";
import { DashboardShell } from "@/components/page/shell";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { getTeacherWithClassId, incrementView } from "@/lib/dashboard/actions";
import { getUser } from "@/lib/user";
import { redirectWithSearchParams } from "@/lib/utils";

export const metadata = Meta.settings;

type Props = {
	searchParams?: Record<string, string>;
};

export default async function ({ searchParams }: Props) {
	const { user } = await getSession();
	const classId = searchParams?.join_class_code;

	if (!user) {
		return redirectWithSearchParams("auth", searchParams);
	}
	incrementView("settings");

	const teacher = classId ? await getTeacherWithClassId(classId) : null;
	const dbUser = await getUser(user.id);
	if (!dbUser) {
		return null;
	}

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.settings.title}
				text={Meta.settings.description}
			/>
			<SettingsForm user={dbUser} />
			{classId && (
				<ClassInviteModal
					user={dbUser}
					teacherToJoin={teacher}
					classId={classId}
				/>
			)}
		</DashboardShell>
	);
}

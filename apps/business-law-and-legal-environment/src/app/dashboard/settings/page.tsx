import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { ClassInviteModal } from "@/components/dashboard/settings/class-invite-modal";
import { DashboardShell } from "@/components/page/shell";
import { getCurrentUser } from "@/lib/auth";
import { getTeacherWithClassId } from "@/lib/class";
import { getUser } from "@/lib/user";
import { redirectWithSearchParams } from "@/lib/utils";
import { Metadata } from "next";

const title = "Settings";
const description = "Manage account and website settings";

export const metadata: Metadata = {
	title,
	description,
};

type Props = {
	searchParams?: Record<string, string>;
};

export default async function ({ searchParams }: Props) {
	const currentUser = await getCurrentUser();
	const classId = searchParams?.join_class_code;

	if (!currentUser) {
		return redirectWithSearchParams("/auth", searchParams);
	}

	const user = await getUser(currentUser.id);
	if (!user) {
		return redirectWithSearchParams("/auth", searchParams);
	}

	const teacher = classId ? await getTeacherWithClassId(classId) : null;

	return (
		<DashboardShell>
			<DashboardHeader heading={title} text={description} />
			<SettingsForm user={user} />
			{classId && (
				<ClassInviteModal
					user={user}
					teacherToJoin={teacher}
					classId={classId}
				/>
			)}
		</DashboardShell>
	);
}

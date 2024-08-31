import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { getTeacherWithClassId, incrementView } from "@/lib/dashboard/actions";
import { routes } from "@/lib/navigation";
import { getUser } from "@/lib/user/actions";
import { redirectWithSearchParams } from "@/lib/utils";
import { JoinClassModal } from "@dashboard//join-class-modal";
import { DashboardHeader, DashboardShell } from "@dashboard//shell";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@itell/ui/card";
import { Separator } from "@itell/ui/separator";
import { JoinClassForm } from "@settings/join-class";
import { Profile } from "@settings/profile";
import { QuitClass } from "@settings/quit-class";
import { WebsiteSettings } from "@settings/website";

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
	const dbUser = await getUser(user.id);
	if (!dbUser) {
		return null;
	}

	incrementView(user.id, "settings", searchParams);

	const teacher = dbUser.classId
		? await getTeacherWithClassId(dbUser.classId)
		: null;

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.settings.title}
				text={Meta.settings.description}
			/>
			<Card>
				<CardHeader>
					<CardTitle>Edit your settings</CardTitle>
					<CardDescription>configure the textbook to your need</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Profile user={user} />
					<Separator />
					<WebsiteSettings user={dbUser} />
					<Separator />
					{teacher ? (
						<div>
							<h3 className="mb-4 text-lg font-medium">Class Information</h3>
							<p className="text-muted-foreground text-sm max-w-lg mb-4">
								You are enrolled in a class taught by {teacher.name}.
							</p>
							<QuitClass userId={user.id} />
						</div>
					) : (
						<div className="space-y-4" id="enroll">
							<h3 className="mb-4 text-lg font-medium">Class Registration</h3>
							<JoinClassForm user={dbUser} />
						</div>
					)}
				</CardContent>
			</Card>
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

import { Separator } from "@/components/client-components";
import { SessionUser } from "@/lib/auth";
import { getTeacherWithClassId } from "@/lib/dashboard/actions";
import { getUser } from "@/lib/user/actions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@itell/ui/server";
import { ClassInfo } from "./settings/class-info";
import { ClassRegister } from "./settings/class-register";
import { Profile } from "./settings/profile";
import { WebsiteSettings } from "./settings/website-settings";

export const SettingsForm = async ({ user }: { user: SessionUser }) => {
	if (!user) {
		return null;
	}
	const teacher = await getTeacherWithClassId(user.classId);

	const dbUser = await getUser(user.id);
	if (!dbUser) {
		return null;
	}

	return (
		<div>
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
						<ClassInfo teacherName={String(teacher.name)} user={dbUser} />
					) : (
						<ClassRegister user={dbUser} />
					)}
				</CardContent>
			</Card>
		</div>
	);
};

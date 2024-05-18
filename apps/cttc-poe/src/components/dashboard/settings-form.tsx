import { Separator } from "@/components/client-components";
import { SessionUser } from "@/lib/auth";
import { getTeacherWithClassId } from "@/lib/dashboard/actions";
import { getUser } from "@/lib/user";
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

export const SettingsForm = async ({
	user: sessionUser,
}: { user: NonNullable<SessionUser> }) => {
	const teacher = await getTeacherWithClassId(sessionUser.classId);
	if (!sessionUser) {
		return null;
	}

	const user = await getUser(sessionUser.id);
	if (!user) {
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
					<Profile user={sessionUser} />
					<Separator />
					<WebsiteSettings user={user} />
					<Separator />
					{teacher ? (
						<ClassInfo teacher={teacher} user={user} />
					) : (
						<ClassRegister user={user} />
					)}
				</CardContent>
			</Card>
		</div>
	);
};

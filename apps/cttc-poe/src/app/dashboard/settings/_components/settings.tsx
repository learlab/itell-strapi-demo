import { Separator } from "@/components/client-components";
import { getTeacherWithClassId } from "@/lib/dashboard/actions";
import { getUser } from "@/lib/user/actions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@itell/ui/server";
import { User } from "lucia";
import { JoinClassForm } from "./join-class";
import { Profile } from "./profile";
import { QuitClass } from "./quit-class";
import { WebsiteSettings } from "./website";

export const Settings = async ({ user }: { user: User | null }) => {
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
		</div>
	);
};

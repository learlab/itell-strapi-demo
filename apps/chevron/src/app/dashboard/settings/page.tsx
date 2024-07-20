import {
	getTeacherByClassAction,
	incrementViewAction,
} from "@/actions/dashboard";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { JoinClassModal } from "@dashboard/join-class-modal";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { Separator } from "@itell/ui/client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@itell/ui/server";
import { JoinClassForm } from "@settings/join-class";
import { Profile } from "@settings/profile";
import { QuitClass } from "@settings/quit-class";
import { WebsiteSettings } from "@settings/website";
import { User } from "lucia";

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

	incrementViewAction({ pageSlug: Meta.settings.slug, data: searchParams });

	let teacher: User | null = null;
	if (user.classId) {
		const [res, err] = await getTeacherByClassAction({ classId: user.classId });
		if (err) {
			throw new Error(err.message);
		}
		teacher = res;
	}

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
					<WebsiteSettings user={user} />
					<Separator />
					{teacher ? (
						<div className="grid gap-2 items-start justify-items-start">
							<h3 className="text-lg font-medium">Class Information</h3>
							<p className="text-muted-foreground text-sm max-w-lg">
								You are enrolled in a class taught by {teacher.name}.
							</p>
							<QuitClass />
						</div>
					) : (
						<div className="space-y-4" id="enroll">
							<h3 className="mb-4 text-lg font-medium">Class Registration</h3>
							<JoinClassForm user={user} />
						</div>
					)}
				</CardContent>
			</Card>
			{classId && teacher && (
				<JoinClassModal
					userClassId={user.classId}
					teacher={teacher}
					classId={classId}
				/>
			)}
		</DashboardShell>
	);
}

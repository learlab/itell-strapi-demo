import {
	getTeacherByClassAction,
	incrementViewAction,
} from "@/actions/dashboard";
import { updateUserAction } from "@/actions/user";
import { SettingsForm } from "@/app/dashboard/settings/_components/settings-form";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { isProduction } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { JoinClassModal } from "@dashboard/join-class-modal";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
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

type Props = {
	searchParams?: Record<string, string>;
};

export default async function ({ searchParams }: Props) {
	const { user } = await getSession();
	const join_class_code =
		routes.settings.$parseSearchParams(searchParams).join_class_code;

	if (!user) {
		return redirectWithSearchParams("auth", searchParams);
	}

	incrementViewAction({ pageSlug: Meta.settings.slug, data: searchParams });

	let teacherName: string | null = null;
	let userClassId: string | null = user.classId;

	if (user.classId) {
		const [data, err] = await getTeacherByClassAction({
			classId: user.classId,
		});
		if (err) {
			throw new Error(err.message);
		}
		if (data) {
			teacherName = data.name;
		} else {
			const [_, err] = await updateUserAction({ id: user.id, classId: null });
			if (err) {
				throw new Error(err.message);
			}
			userClassId = null;
		}
	} else {
		if (join_class_code) {
			const [data, err] = await getTeacherByClassAction({
				classId: join_class_code,
			});
			if (err) {
				throw new Error(err.message);
			}
			if (data) {
				teacherName = data.name;
			}
		}
	}

	if (user.classId) {
		const [data, err] = await getTeacherByClassAction({
			classId: user.classId,
		});
		if (err) {
			throw new Error(err.message);
		}
		if (data) {
			teacherName = data.name;
		}
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
					<SettingsForm user={user} />
					<Separator />
					{teacherName ? (
						<div className="grid gap-2 items-start justify-items-start">
							<h3 className="text-lg font-medium">Class Information</h3>
							<p className="text-muted-foreground text-sm max-w-lg">
								You are enrolled in a class taught by {teacherName}.
							</p>
							{!isProduction && <QuitClass />}
						</div>
					) : (
						<div className="space-y-4" id="enroll">
							<h3 className="mb-4 text-lg font-medium">Class Registration</h3>
							<JoinClassForm user={user} />
						</div>
					)}
				</CardContent>
			</Card>
			{join_class_code && !userClassId && (
				<JoinClassModal
					userClassId={user.classId}
					teacherName={teacherName}
					classId={join_class_code}
				/>
			)}
		</DashboardShell>
	);
}

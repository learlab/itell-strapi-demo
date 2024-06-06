import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ClassStudentCount } from "@/components/dashboard/student/class-student-count";
import { UserStatistics } from "@/components/dashboard/user-statistics";
import { UserProgress } from "@/components/dashboard/user/user-progress";
import { DashboardShell } from "@/components/page/shell";
import { Spinner } from "@/components/spinner";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { incrementView } from "@/lib/dashboard/actions";
import { routes } from "@/lib/navigation";
import { getUser } from "@/lib/user/actions";
import { redirectWithSearchParams } from "@/lib/utils";
import { ReadingTimeChartLevel } from "@itell/core/types";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = Meta.dashboard;

type Props = {
	searchParams?: unknown;
};

export default async function ({ searchParams }: Props) {
	const { user } = await getSession();
	if (!user) {
		return redirectWithSearchParams("auth", searchParams);
	}

	const { reading_time_level } =
		routes.dashboard.$parseSearchParams(searchParams);
	let readingTimeLevel = ReadingTimeChartLevel.week_1;
	if (
		Object.values(ReadingTimeChartLevel).includes(
			reading_time_level as ReadingTimeChartLevel,
		)
	) {
		readingTimeLevel = reading_time_level as ReadingTimeChartLevel;
	}

	incrementView(user.id, "dashboard", searchParams);

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.dashboard.title}
				text={Meta.dashboard.description}
			/>

			<div className="space-y-4">
				<div className="px-2">
					<UserProgress pageSlug={user.pageSlug} finished={user.finished} />
				</div>
				{user.classId ? (
					<p className="p-2 text-muted-foreground">
						You are enrolled in a class with{" "}
						<Suspense fallback={<Spinner className="inline" />}>
							<ClassStudentCount classId={user.classId} />
						</Suspense>
					</p>
				) : (
					<p className="p-2 text-muted-foreground">
						You are not enrolled in any class. Enter your class code in{" "}
						<Link href="/dashboard/settings#enroll" className="underline">
							Settings
						</Link>{" "}
						to enroll in a class
					</p>
				)}

				<UserStatistics
					userId={user.id}
					userClassId={user.classId}
					readingTimeLevel={readingTimeLevel}
				/>
			</div>
		</DashboardShell>
	);
}

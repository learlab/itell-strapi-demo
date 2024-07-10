import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { incrementView } from "@/lib/dashboard/actions";
import { routes } from "@/lib/navigation";
import { delay, redirectWithSearchParams } from "@/lib/utils";
import { DashboardHeader, DashboardShell } from "@dashboard//shell";
import { UserProgress } from "@dashboard//user-progress";
import { UserStatistics } from "@dashboard//user-statistics";
import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { Card, CardContent } from "@itell/ui/server";

export const metadata = Meta.dashboard;

type Props = {
	searchParams?: unknown;
};

export default async function ({ searchParams }: Props) {
	const { user } = await getSession();
	await delay(1000);
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
			<Card>
				<CardContent className="space-y-4">
					<div className="text-center">
						<UserProgress pageSlug={user.pageSlug} finished={user.finished} />
					</div>

					<UserStatistics user={user} readingTimeLevel={readingTimeLevel} />
				</CardContent>
			</Card>
		</DashboardShell>
	);
}

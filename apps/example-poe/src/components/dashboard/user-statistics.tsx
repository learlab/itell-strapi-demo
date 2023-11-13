import { User } from "@prisma/client";
import { Suspense } from "react";
import { StudentBadges } from "./student/student-badges";
import { UserBadges } from "./user/user-badges";
import { ReadingTime } from "./reading-time";
import {
	ReadingTimeChartLevel,
	ReadingTimeChartParams,
} from "@itell/core/types";
import { UserStatisticsControl } from "./user-statistics-control";
import { z } from "zod";
import { DashboardBadge } from "@itell/ui/server";

type Props = {
	user: User;
	searchParams?: Record<string, string>;
};

const ParamsSchema = z.object({
	reading_time_level: z.nativeEnum(ReadingTimeChartLevel),
});

export const UserStatistics = ({ user, searchParams }: Props) => {
	// if searchParams is not passed as prop here, readingTimeParams will always be week 1
	// and switching levels in UserStatisticsControl won't work (although query params are set)
	// future work is to restructure the component hierarchy
	const params = ParamsSchema.safeParse(searchParams);
	const readingTimeParams = params.success
		? { level: params.data.reading_time_level }
		: { level: ReadingTimeChartLevel.week_1 };

	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Suspense fallback={<DashboardBadge.Skeletons />}>
					{user.classId ? (
						<StudentBadges user={user} />
					) : (
						<UserBadges uid={user.id} />
					)}
				</Suspense>
			</div>
			<UserStatisticsControl />
			<Suspense
				key={readingTimeParams.level}
				fallback={<ReadingTime.Skeleton />}
			>
				<ReadingTime uid={user.id} params={readingTimeParams} />
			</Suspense>
		</div>
	);
};

import { User } from "@/drizzle/schema";
import { SessionUser } from "@/lib/auth";
import {
	ReadingTimeChartLevel,
	ReadingTimeChartParams,
} from "@itell/core/types";
import { DashboardBadge } from "@itell/ui/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReadingTime } from "./reading-time";
import { StudentBadges } from "./student/student-badges";
import { UserBadges } from "./user/user-badges";

type Props = {
	user: User;
	readingTimeLevel: ReadingTimeChartLevel;
};

export const UserStatistics = ({ user, readingTimeLevel }: Props) => {
	// if searchParams is not passed as prop here, readingTimeParams will always be week 1
	// and switching levels in UserStatisticsControl won't work (although query params are set)
	// future work is to restructure the component hierarchy
	const readingTimeParams: ReadingTimeChartParams = {
		level: readingTimeLevel,
	};

	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Suspense fallback={<DashboardBadge.Skeletons />}>
					<ErrorBoundary fallback={<UserBadges.ErrorFallback />}>
						{user.classId ? (
							<StudentBadges user={user} />
						) : (
							<UserBadges uid={user.id} />
						)}
					</ErrorBoundary>
				</Suspense>
			</div>

			<Suspense fallback={<ReadingTime.Skeleton />}>
				<ErrorBoundary fallback={<ReadingTime.ErrorFallback />}>
					<ReadingTime uid={user.id} params={readingTimeParams} />
				</ErrorBoundary>
			</Suspense>
		</div>
	);
};

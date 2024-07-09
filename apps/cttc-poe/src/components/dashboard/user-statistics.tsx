import {
	ReadingTimeChartLevel,
	ReadingTimeChartParams,
} from "@itell/core/dashboard";
import { User } from "lucia";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReadingTime } from "./reading-time";
import { UserDetails } from "./user/user-details";

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
			<Suspense fallback={<UserDetails.Skeleton />}>
				<ErrorBoundary fallback={<UserDetails.ErrorFallback />}>
					<UserDetails
						userId={user.id}
						pageSlug={user.pageSlug}
						classId={user.classId}
					/>
				</ErrorBoundary>
			</Suspense>

			<Suspense fallback={<ReadingTime.Skeleton />}>
				<ErrorBoundary fallback={<ReadingTime.ErrorFallback />}>
					<ReadingTime userId={user.id} params={readingTimeParams} />
				</ErrorBoundary>
			</Suspense>
		</div>
	);
};

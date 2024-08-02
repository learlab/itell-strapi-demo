import {
	countStudentAction,
	getOtherStatsAction,
	getOtherUsersAction,
	getUserStatsAction,
} from "@/actions/dashboard";
import { CreateErrorFallback } from "@/components/error-fallback";
import { Spinner } from "@/components/spinner";
import { getPageData } from "@/lib/utils";
import { DashboardBadge, Skeleton } from "@itell/ui/server";
import { cn, median } from "@itell/utils";
import {
	FileTextIcon,
	FlagIcon,
	PencilIcon,
	WholeWordIcon,
} from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { Suspense } from "react";
import { TrendChart } from "./trend-chart";
import { UserRadarChart } from "./user-radar-chart";

type Props = {
	classId: string | null;
	pageSlug: string | null;
};

export const UserDetails = async ({ classId, pageSlug }: Props) => {
	const [otherUsers, err] = await getOtherUsersAction();
	if (err) {
		throw new Error(err.message);
	}

	const [[userStats, err1], [otherStats, err2]] = await Promise.all([
		getUserStatsAction(),
		getOtherStatsAction({ ids: otherUsers.map((user) => user.id) }),
	]);

	if (err1) {
		throw new Error(err1.message);
	}

	if (err2) {
		throw new Error(err2.message);
	}

	const pageIndex = getPageData(pageSlug)?.index;
	const userProgress = pageIndex !== undefined ? pageIndex + 1 : 0;
	const otherProgress = otherUsers.map((user) => {
		const pageIndex = getPageData(pageSlug)?.index;
		return pageIndex !== undefined ? pageIndex + 1 : 0;
	});

	const midProgress = median(otherProgress) || 0;

	const diffs = {
		totalSummaries: userStats.totalSummaries - otherStats.totalSummaries,
		totalPassedSummaries:
			userStats.totalPassedSummaries - otherStats.totalPassedSummaries,
		totalAnswers: userStats.totalAnswers - otherStats.totalAnswers,
		totalPassedAnswers:
			userStats.totalPassedAnswers - otherStats.totalPassedAnswers,
		contentScore:
			userStats.contentScore && otherStats.contentScore
				? userStats.contentScore - otherStats.contentScore
				: null,
		languageScore:
			userStats.languageScore && otherStats.languageScore
				? userStats.languageScore - otherStats.languageScore
				: null,
	};

	return (
		<div className="space-y-4">
			<UserRadarChart
				userStats={userStats}
				otherStats={otherStats}
				userProgress={userProgress}
				otherProgress={midProgress}
			/>
			<p aria-hidden="true" className="text-center text-muted-foreground">
				percentages are relative to the median
			</p>
			{classId ? (
				<p className="text-center text-muted-foreground">
					comparing with{" "}
					<Suspense fallback={<Spinner className="inline" />}>
						<StudentCount classId={classId} />
					</Suspense>{" "}
					from the same class
				</p>
			) : (
				<p className="text-center text-muted-foreground">
					Enter your class code in{" "}
					<Link href="/dashboard/settings#enroll" className="underline">
						Settings
					</Link>{" "}
					to join a class.
				</p>
			)}

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<DashboardBadge
					title="Total Summaries"
					icon={<PencilIcon className="size-4" />}
					className={cn({
						"border-green-500": diffs.totalSummaries > 0,
						"border-destructive": diffs.totalSummaries < 0,
					})}
				>
					<div className="flex items-baseline gap-2 h-6 mb-2">
						<div className="text-2xl font-bold">{userStats.totalSummaries}</div>
						<TrendChart
							prev={userStats.totalSummariesLastWeek}
							current={userStats.totalSummaries}
							label="Total Summaries"
						/>
					</div>
					<p className="text-xs text-muted-foreground">
						{diffs.totalSummaries > 0 ? "+" : ""}
						{Math.round(diffs.totalSummaries)} compared to others
					</p>
				</DashboardBadge>
				<DashboardBadge
					title="Passed Summaries"
					icon={<FlagIcon className="size-4" />}
					className={cn({
						"border-green-500": diffs.totalPassedSummaries > 0,
						"border-destructive": diffs.totalPassedSummaries < 0,
					})}
				>
					<div className="flex items-baseline gap-2 h-6 mb-2">
						<div className="text-2xl font-bold">
							{userStats.totalPassedSummaries}
						</div>
						<TrendChart
							prev={userStats.totalPassedSummariesLastWeek}
							current={userStats.totalPassedSummaries}
							label="Passed Summaries"
						/>
					</div>
					<p className="text-xs text-muted-foreground">
						{diffs.totalPassedSummaries > 0 ? "+" : ""}
						{Math.round(diffs.totalPassedSummaries)} compared to others
					</p>
				</DashboardBadge>
				<DashboardBadge
					title="Median Content Score"
					icon={<FileTextIcon className="size-4" />}
					className={cn({
						"border-green-500": diffs.contentScore && diffs.contentScore > 0,
						"border-destructive": diffs.contentScore && diffs.contentScore < 0,
					})}
				>
					<div className="flex items-baseline gap-2 h-6 mb-2">
						<div className="text-2xl font-bold">
							{userStats.contentScore
								? userStats.contentScore.toFixed(2)
								: "NA"}
						</div>
						{userStats.contentScoreLastWeek && (
							<TrendChart
								prev={userStats.contentScoreLastWeek}
								current={userStats.contentScore}
								label="Content Score"
							/>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						{diffs.contentScore
							? `
					${diffs.contentScore > 0 ? "+" : ""}${diffs.contentScore.toFixed(
						2,
					)} compared to others`
							: "class stats unavailable"}
					</p>
				</DashboardBadge>
				<DashboardBadge
					title="Median Language Score"
					icon={<WholeWordIcon className="size-4" />}
					className={cn({
						"border-green-500": diffs.languageScore && diffs.languageScore > 0,
						"border-destructive":
							diffs.languageScore && diffs.languageScore < 0,
					})}
				>
					<div className="flex items-baseline gap-2 h-6 mb-2">
						<div className="text-2xl font-bold">
							{userStats.languageScore
								? userStats.languageScore.toFixed(2)
								: "NA"}
						</div>
						{userStats.languageScoreLastWeek && (
							<TrendChart
								prev={userStats.languageScoreLastWeek}
								current={userStats.languageScore}
								label="Language Score"
							/>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						{diffs.languageScore
							? `
					${diffs.languageScore > 0 ? "+" : ""}${diffs.languageScore.toFixed(
						2,
					)} compared to others`
							: "class stats unavailable"}
					</p>
				</DashboardBadge>
			</div>
		</div>
	);
};

UserDetails.ErrorFallback = CreateErrorFallback(
	"Failed to calculate learning statistics",
);

UserDetails.Skeleton = () => (
	<div className="space-y-4">
		<div className="flex flex-col gap-2 items-center justify-center">
			<Skeleton className="aspect-square h-[300px]" />
		</div>
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<DashboardBadge.Skeletons />
		</div>
	</div>
);

const StudentCount = async ({ classId }: { classId: string }) => {
	const [numStudents, err] = await countStudentAction({ classId });
	if (!err) {
		return <span>{pluralize("student", numStudents, true)}</span>;
	}
};

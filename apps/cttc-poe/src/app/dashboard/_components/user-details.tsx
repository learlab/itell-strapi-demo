import { CreateErrorFallback } from "@/components/error-fallback";
import { Spinner } from "@/components/spinner";
import { getOtherStats, getUserStats } from "@/lib/dashboard";
import { countStudent, getOtherUsers } from "@/lib/dashboard/class";
import { getPageData } from "@/lib/utils";
import { cn } from "@itell/core/utils";
import { DashboardBadge, Skeleton } from "@itell/ui/server";
import {
	FileTextIcon,
	FlagIcon,
	PencilIcon,
	WholeWordIcon,
} from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { Suspense } from "react";
import { UserRadarChart } from "./user-radar-chart";

type Props = {
	userId: string;
	pageSlug: string | null;
	classId: string | null;
};

export const UserDetails = async ({ userId, pageSlug, classId }: Props) => {
	const otherUsers = await getOtherUsers(classId ? { classId } : { userId });
	const [userStats, otherStats] = await Promise.all([
		getUserStats(userId),
		getOtherStats(otherUsers),
	]);

	const pageIndex = getPageData(pageSlug)?.index;
	const userProgress = pageIndex !== undefined ? pageIndex + 1 : 0;
	const otherProgress =
		otherUsers.reduce((acc, user) => {
			const data = getPageData(user.pageSlug);
			if (data) {
				acc += data.index;
			}
			return acc;
		}, 0) /
			otherUsers.length +
		1;

	const diffs = {
		totalSummaries: userStats.totalSummaries - otherStats.avgTotalSummaries,
		totalPassedSummaries:
			userStats.totalPassedSummaries - otherStats.avgTotalPassedSummaries,
		totalAnswers: userStats.totalAnswers - otherStats.avgTotalAnswers,
		totalPassedAnswers:
			userStats.totalPassedAnswers - otherStats.avgTotalPassedAnswers,
		avgContentScore:
			userStats.avgContentScore && otherStats.avgContentScore
				? userStats.avgContentScore - otherStats.avgContentScore
				: null,
		avgLanguageScore:
			userStats.avgLanguageScore && otherStats.avgLanguageScore
				? userStats.avgLanguageScore - otherStats.avgLanguageScore
				: null,
	};

	return (
		<div className="space-y-4">
			<UserRadarChart
				userStats={userStats}
				otherStats={otherStats}
				userProgress={userProgress}
				otherProgress={otherProgress}
			/>
			<p className="text-center text-muted-foreground">
				percentages are relative to the average
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
					<div className="text-2xl font-bold">{userStats.totalSummaries}</div>
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
					<div className="text-2xl font-bold">
						{userStats.totalPassedSummaries}
					</div>
					<p className="text-xs text-muted-foreground">
						{diffs.totalPassedSummaries > 0 ? "+" : ""}
						{Math.round(diffs.totalPassedSummaries)} compared to others
					</p>
				</DashboardBadge>
				<DashboardBadge
					title="Average Content Score"
					icon={<FileTextIcon className="size-4" />}
					className={cn({
						"border-green-500":
							diffs.avgContentScore && diffs.avgContentScore > 0,
						"border-destructive":
							diffs.avgContentScore && diffs.avgContentScore < 0,
					})}
				>
					<div className="text-2xl font-bold">
						{Number.isNaN(userStats.avgContentScore)
							? "NA"
							: userStats.avgContentScore.toFixed(2)}
					</div>
					<p className="text-xs text-muted-foreground">
						{diffs.avgContentScore
							? `
					${
						diffs.avgContentScore > 0 ? "+" : ""
					}${diffs.avgContentScore.toFixed(2)} compared to others`
							: "class stats unavailable"}
					</p>
				</DashboardBadge>
				<DashboardBadge
					title="Average Language Score"
					icon={<WholeWordIcon className="size-4" />}
					className={cn({
						"border-green-500":
							diffs.avgLanguageScore && diffs.avgLanguageScore > 0,
						"border-destructive":
							diffs.avgLanguageScore && diffs.avgLanguageScore < 0,
					})}
				>
					<div className="text-2xl font-bold">
						{Number.isNaN(userStats.avgLanguageScore)
							? "NA"
							: userStats.avgLanguageScore.toFixed(2)}
					</div>
					<p className="text-xs text-muted-foreground">
						{diffs.avgLanguageScore
							? `
					${
						diffs.avgLanguageScore > 0 ? "+" : ""
					}${diffs.avgLanguageScore.toFixed(2)} compared to others`
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
	const numStudents = await countStudent(classId);

	return <span>{pluralize("student", numStudents, true)}</span>;
};

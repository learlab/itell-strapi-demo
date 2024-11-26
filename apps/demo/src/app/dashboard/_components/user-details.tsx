import { Suspense } from "react";
import Link from "next/link";
import { DashboardBadge } from "@itell/ui/dashboard-badge";
import { Skeleton } from "@itell/ui/skeleton";
import { cn, median } from "@itell/utils";
import { FileTextIcon, FlagIcon, PencilIcon } from "lucide-react";
import pluralize from "pluralize";

import {
  countStudentAction,
  getOtherStatsAction,
  getOtherUsersAction,
  getUserStatsAction,
} from "@/actions/dashboard";
import { CreateErrorFallback } from "@/components/error-fallback";
import { Spinner } from "@/components/spinner";
import { getPageData } from "@/lib/pages/pages.server";
import { TrendChart } from "./trend-chart";
import { UserRadarChart } from "./user-radar-chart";

type Props = {
  classId: string | null;
  pageSlug: string | null;
};

export async function UserDetails({ classId, pageSlug }: Props) {
  const [otherUsers, err] = await getOtherUsersAction();
  if (err) {
    throw new Error("failed to get other users", { cause: err });
  }

  if (otherUsers.length === 0) {
    return (
      <p className="text-muted-foreground">
        Detailed statistics is currently unavailable.
      </p>
    );
  }
  const [[userStats, err1], [otherStats, err2]] = await Promise.all([
    getUserStatsAction(),
    getOtherStatsAction({ ids: otherUsers.map((user) => user.id) }),
  ]);

  if (err1) {
    throw new Error(err1.message, { cause: err1 });
  }

  if (err2) {
    throw new Error(err2.message, { cause: err2 });
  }

  const pageIndex = getPageData(pageSlug)?.order;
  const userProgress = pageIndex !== undefined ? pageIndex + 1 : 0;
  const otherProgressArr = otherUsers.map((user) => {
    const pageIndex = getPageData(user.pageSlug)?.order;
    return pageIndex !== undefined ? pageIndex + 1 : 0;
  });
  const otherProgress = median(otherProgressArr) ?? 0;

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
  };

  const radarChartData = {
    progress: {
      label: "Progress",
      user: userProgress,
      other: otherProgress,
      userScaled: scale(userProgress, otherProgress),
      otherScaled: 1,
      description: "Number of pages unlocked",
    },
    totalSummaries: {
      label: "Total Summaries",
      user: userStats.totalSummaries,
      other: otherStats.totalSummaries,
      userScaled: scale(userStats.totalSummaries, otherStats.totalSummaries),
      otherScaled: 1,
      description: "Total number of summaries submitted",
    },
    passedSummaries: {
      label: "Passed Summaries",
      user: userStats.totalPassedSummaries,
      other: otherStats.totalPassedSummaries,
      userScaled: scale(
        userStats.totalPassedSummaries,
        otherStats.totalPassedSummaries
      ),
      otherScaled: 1,
      description:
        "Total number of summaries that scored well in both content score and language score",
    },
    contentScore: {
      label: "Content Score",
      user: userStats.contentScore,
      other: otherStats.contentScore,
      userScaled:
        userStats.contentScore && otherStats.contentScore
          ? scale(userStats.contentScore, otherStats.contentScore)
          : 0,
      otherScaled: 1,
      description:
        "Measures the semantic similarity between the summary and the original text. The higher the score, the better the summary describes the main points of the text.",
    },
    correctCriAnswers: {
      label: "Correct Question Answers",
      user: userStats.totalPassedAnswers,
      other: otherStats.totalPassedAnswers,
      userScaled: scale(
        userStats.totalPassedAnswers,
        otherStats.totalPassedAnswers
      ),
      otherScaled: 1,
      description: "Total number of questions answered during reading.",
    },
  };

  return (
    <div className="space-y-4">
      <UserRadarChart data={radarChartData} />
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
          <div className="mb-2 flex h-6 items-baseline gap-2">
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
          <div className="mb-2 flex h-6 items-baseline gap-2">
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
          <div className="mb-2 flex h-6 items-baseline gap-2">
            <div className="text-2xl font-bold">
              {userStats.contentScore
                ? userStats.contentScore.toFixed(2)
                : "NA"}
            </div>
            {userStats.contentScoreLastWeek ? (
              <TrendChart
                prev={userStats.contentScoreLastWeek}
                current={userStats.contentScore}
                label="Content Score"
              />
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            {diffs.contentScore
              ? `
					${diffs.contentScore > 0 ? "+" : ""}${diffs.contentScore.toFixed(
            2
          )} compared to others`
              : "class stats unavailable"}
          </p>
        </DashboardBadge>
      </div>
    </div>
  );
}

UserDetails.ErrorFallback = CreateErrorFallback(
  "Failed to calculate learning statistics"
);

UserDetails.Skeleton = function () {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <Skeleton className="aspect-square h-[300px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardBadge.Skeletons />
      </div>
    </div>
  );
};

async function StudentCount({ classId }: { classId: string }) {
  const [numStudents, err] = await countStudentAction({ classId });
  if (!err) {
    return <span>{pluralize("student", numStudents, true)}</span>;
  }
}

// function to scale the user's value relative to that of the others, which is treated as 1
const scale = (a: number, b: number) => {
  if (Math.abs(b) < Number.EPSILON) {
    return a === 0 ? 0 : 2;
  }

  return a / Math.abs(b);
};

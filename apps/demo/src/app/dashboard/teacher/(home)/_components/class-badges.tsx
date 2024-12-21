import { DashboardBadge } from "@itell/ui/dashboard-badge";
import { FileTextIcon, FlagIcon, PencilIcon } from "lucide-react";

import { getOtherStatsAction } from "@/actions/dashboard";
import { CreateErrorFallback } from "@/components/error-fallback";

type Props = {
  ids: string[];
};

export async function ClassBadges({ ids }: Props) {
  const [classStats, err] = await getOtherStatsAction({
    ids,
  });
  if (err) {
    throw new Error("failed to get class statistics", { cause: err });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <DashboardBadge title="Total Summaries" icon={<PencilIcon />}>
        <div className="text-2xl font-bold">{classStats.totalSummaries}</div>
      </DashboardBadge>
      <DashboardBadge title="Passed Summaries" icon={<FlagIcon />}>
        <div className="text-2xl font-bold">
          {classStats.totalPassedSummaries}
        </div>
      </DashboardBadge>
      <DashboardBadge title="Content Score" icon={<FileTextIcon />}>
        <div className="text-2xl font-bold">
          {classStats.contentScore ? classStats.contentScore.toFixed(2) : "NA"}
        </div>
      </DashboardBadge>
      <DashboardBadge title="Answers" icon={<PencilIcon />}>
        <div className="text-2xl font-bold">{classStats.totalAnswers}</div>
      </DashboardBadge>
      <DashboardBadge title="Correct Answers" icon={<FlagIcon />}>
        <div className="text-2xl font-bold">
          {classStats.totalPassedAnswers}
        </div>
      </DashboardBadge>
    </div>
  );
}

ClassBadges.Skeleton = function () {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardBadge.Skeletons />
    </div>
  );
};

ClassBadges.ErrorFallback = CreateErrorFallback(
  "Failed to calculate class statistics"
);

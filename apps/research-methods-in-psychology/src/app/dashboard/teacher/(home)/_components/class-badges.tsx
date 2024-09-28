import { getOtherStatsAction } from "@/actions/dashboard";
import { CreateErrorFallback } from "@/components/error-fallback";
import { DashboardBadge } from "@itell/ui/dashboard-badge";
import {
  FileTextIcon,
  FlagIcon,
  PencilIcon,
  WholeWordIcon,
} from "lucide-react";

type Props = {
  students: { id: string }[];
};

export async function ClassBadges({ students }: Props) {
  const [classStats, err] = await getOtherStatsAction({
    ids: students.map((student) => student.id),
  });
  if (err) {
    throw new Error("failed to get class statistics", { cause: err });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <DashboardBadge title="Language Score" icon={<WholeWordIcon />}>
        <div className="text-2xl font-bold">
          {classStats.languageScore
            ? classStats.languageScore.toFixed(2)
            : "NA"}
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

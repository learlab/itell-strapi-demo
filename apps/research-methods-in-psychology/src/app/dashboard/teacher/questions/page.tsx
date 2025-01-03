import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { QuestionChart } from "@questions/question-chart";
import pluralize from "pluralize";

import { incrementViewAction } from "@/actions/dashboard";
import { getAnswerStatsClassAction } from "@/actions/question";
import { Meta } from "@/config/metadata";
import { getScoreMeta } from "../../questions/get-label";
import { checkTeacher } from "../check-teacher";

export default async function Page() {
  const teacher = await checkTeacher();
  if (!teacher) {
    return notFound();
  }

  incrementViewAction({ pageSlug: Meta.questionsTeacher.slug });
  const [data, err] = await getAnswerStatsClassAction({
    classId: teacher.classId,
  });
  if (err) {
    throw new Error("failed to get answer statistics", { cause: err });
  }
  const { byScore } = data;
  const count = byScore.reduce((acc, s) => acc + s.count, 0);

  const chartData = byScore.map((s) => {
    const { label, description } = getScoreMeta(s.score);
    return {
      name: label,
      value: s.count,
      fill: `var(--color-${label})`,
      description,
    };
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.questionsTeacher.title}
        text={Meta.questionsTeacher.description}
      />
      <Card>
        <CardHeader>
          <CardDescription>
            {pluralize("question", count, true)} was answered in total
          </CardDescription>
        </CardHeader>
        {count > 0 && (
          <CardContent className="space-y-4">
            <QuestionChart data={chartData} />
          </CardContent>
        )}
      </Card>
    </DashboardShell>
  );
}

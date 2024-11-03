import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { Card, CardContent } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { UserProgress } from "@dashboard/user-progress";
import { UserStatistics } from "@dashboard/user-statistics";

import { incrementViewAction } from "@/actions/dashboard";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

type Props = {
  searchParams?: Promise<unknown>;
};

export default async function (props: Props) {
  const searchParams = await props.searchParams;
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("auth", searchParams);
  }

  const { reading_time_level } =
    routes.dashboard.$parseSearchParams(searchParams);
  let readingTimeLevel = ReadingTimeChartLevel.week_1;
  if (
    Object.values(ReadingTimeChartLevel).includes(
      reading_time_level as ReadingTimeChartLevel
    )
  ) {
    readingTimeLevel = reading_time_level as ReadingTimeChartLevel;
  }

  incrementViewAction({ pageSlug: Meta.home.slug, data: searchParams });

  return (
    <DashboardShell>
      <DashboardHeader heading={Meta.home.title} text={Meta.home.description} />
      <Card>
        <CardContent className="space-y-4">
          <div className="text-center">
            <UserProgress pageSlug={user.pageSlug} finished={user.finished} />
          </div>

          <UserStatistics
            classId={user.classId}
            pageSlug={user.pageSlug}
            readingTimeLevel={readingTimeLevel}
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

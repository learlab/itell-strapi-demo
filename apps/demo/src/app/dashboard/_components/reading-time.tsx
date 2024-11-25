import Link from "next/link";
import { getReadingTimeChartData, PrevDaysLookup } from "@itell/core/dashboard";
import { Button } from "@itell/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itell/ui/hover-card";
import { Skeleton } from "@itell/ui/skeleton";
import { getDatesBetween } from "@itell/utils";
import { InfoIcon } from "lucide-react";
import pluralize from "pluralize";

import { countSummaryAction, getReadingTimeAction } from "@/actions/dashboard";
import { CreateErrorFallback } from "@/components/error-fallback";
import { ReadingTimeChart } from "./reading-time-chart";
import { ReadingTimeControl } from "./reading-time-control";
import type { ReadingTimeChartParams } from "@itell/core/dashboard";

type Props = {
  params: ReadingTimeChartParams;
  name?: string;
};

export async function ReadingTime({ params, name }: Props) {
  const startDate = subDays(new Date(), PrevDaysLookup[params.level]);
  const intervalDates = getDatesBetween(startDate, new Date());
  const [[summaryCount, err1], [readingTimeGrouped, err2]] = await Promise.all([
    countSummaryAction({ startDate }),
    getReadingTimeAction({ startDate, intervalDates }),
  ]);

  if (err1) {
    throw new Error(err1.message, { cause: err1 });
  }

  if (err2) {
    throw new Error(err2.message, { cause: err2 });
  }

  const { totalViewTime, chartData } = getReadingTimeChartData(
    readingTimeGrouped,
    intervalDates,
    params
  );
  return (
    <Card className="has-[[data-pending]]:animate-pulse">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="link"
                  size="lg"
                  className="flex items-center gap-1 pl-0 text-lg xl:text-xl"
                >
                  Total Reading Time
                  <InfoIcon className="size-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <p className="text-sm font-semibold">
                  Measures how long a user has stayed in all textbook pages, in
                  minutes
                </p>
              </HoverCardContent>
            </HoverCard>
            <ReadingTimeControl />
          </div>
        </CardTitle>
        <CardDescription>
          {name ? name : "You"} spent {Math.round(totalViewTime / 60)} minutes
          reading the textbook, wrote{" "}
          <Link className="font-semibold underline" href="/dashboard/summaries">
            {pluralize("summary", summaryCount, true)}
          </Link>{" "}
          during {startDate.toLocaleDateString()} -{" "}
          {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pl-2">
        <ReadingTimeChart data={chartData} />
      </CardContent>
    </Card>
  );
}

ReadingTime.Skeleton = function () {
  return <Skeleton className="h-[350px] w-full" />;
};
ReadingTime.ErrorFallback = CreateErrorFallback(
  "Failed to calculate total reading time"
);

const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(date.getDate() - days);
  return result;
};

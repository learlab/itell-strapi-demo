import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { SummaryItemSkeleton } from "@summaries/summary-list";

import { Meta } from "@/config/metadata";

export default function () {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.summaries.title}
        text={Meta.summaries.description}
      />
      <Card>
        <CardContent className="space-y-4">
          <Card>
            <CardHeader className="items-center pb-0">
              <CardTitle className="text-center text-lg font-semibold">
                Summary Submission History
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-2">
              <Skeleton className="aspect-square h-[300px]" />
            </CardContent>
          </Card>
          <div className="flex flex-col items-center justify-between p-2 sm:flex-row">
            <Skeleton className="h-12 w-[300px]" />
            <Skeleton className="h-12 w-[150px]" />
          </div>
          <div className="divide-border-200 divide-y rounded-md border">
            <SummaryItemSkeleton />
            <SummaryItemSkeleton />
            <SummaryItemSkeleton />
            <SummaryItemSkeleton />
            <SummaryItemSkeleton />
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

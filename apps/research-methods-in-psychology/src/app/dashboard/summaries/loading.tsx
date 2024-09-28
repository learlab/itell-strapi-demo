import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { Card, CardContent } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { SummaryItemSkeleton } from "@summaries/summary-list";

export default function () {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.summaries.title}
        text={Meta.summaries.description}
      />
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-center text-lg font-semibold">
              Summary Submission History
            </p>
            <div className="flex items-center justify-center">
              <Skeleton className="aspect-square h-[300px]" />
            </div>
          </div>
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

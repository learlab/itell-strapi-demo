import { Skeleton } from "@itell/ui/skeleton";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";

import { Meta } from "@/config/metadata";

export default function QuestionsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.questions.title}
        text={Meta.questions.description}
      />
      <div className="space-y-6">
        <Skeleton className="h-[350px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </DashboardShell>
  );
}

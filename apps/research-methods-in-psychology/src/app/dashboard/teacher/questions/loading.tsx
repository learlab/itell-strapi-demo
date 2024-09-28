import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { Skeleton } from "@itell/ui/skeleton";

export default function () {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.questionsTeacher.title}
        text={Meta.questionsTeacher.description}
      />
      <div className="space-y-6">
        <Skeleton className="h-[350px] w-full" />
      </div>
    </DashboardShell>
  );
}

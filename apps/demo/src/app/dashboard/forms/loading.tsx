import { Skeleton } from "@itell/ui/skeleton";

import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "../_components/shell";

export default function FormsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.forms.title}
        text={Meta.forms.description}
      />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </DashboardShell>
  );
}

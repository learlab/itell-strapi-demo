import { DashboardHeader, DashboardShell } from "@dashboard/shell";

import { Meta } from "@/config/metadata";
import { ClassInfo } from "./_components/class-info";

export default function () {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.homeTeacher.title}
        text={Meta.homeTeacher.description}
      />
      <ClassInfo.Skeleton />
    </DashboardShell>
  );
}

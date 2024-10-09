import { incrementViewAction } from "@/actions/dashboard";
import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { notFound } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { checkTeacher } from "../check-teacher";
import { ClassInfo } from "./_components/class-info";

export default async function () {
  const teacher = await checkTeacher();
  if (!teacher) {
    return notFound();
  }

  incrementViewAction({ pageSlug: Meta.homeTeacher.slug });

  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.homeTeacher.title}
        text={Meta.homeTeacher.description}
      />
      <ErrorBoundary fallback={<ClassInfo.ErrorFallback />}>
        <ClassInfo userId={teacher.id} classId={teacher.classId} />
      </ErrorBoundary>
    </DashboardShell>
  );
}

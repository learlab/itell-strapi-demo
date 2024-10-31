import Link from "next/link";
import { redirect } from "next/navigation";
import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { buttonVariants } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { UserProgress } from "@dashboard/user-progress";
import { UserStatistics } from "@dashboard/user-statistics";

import { getTeacherAction, getUserAction } from "@/actions/user";
import { Meta } from "@/config/metadata";
import { type User } from "@/drizzle/schema";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { getPageData } from "@/lib/pages/pages.client";
import { firstAssignmentPage } from "@/lib/pages/pages.server";

interface PageProps {
  params: Promise<unknown>;
  searchParams?: Promise<unknown>;
}

export default async function(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { user } = await getSession();

  if (!user) {
    return redirect("/auth");
  }

  const [teacher, error] = await getTeacherAction();
  if (error) {
    throw new Error("failed to get teacher", { cause: error });
  }

  const isTeacher = Boolean(teacher);
  if (!isTeacher) {
    throw new Error("teacher only");
  }

  const { id } = routes.student.$parseParams(params);
  const [student, err] = await getUserAction({ userId: id });
  if (!student || err) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading={Meta.student.title}
          text={Meta.student.description}
        />
        <Errorbox>The student does not exist in your class</Errorbox>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.student.title}
        text={Meta.student.description}
      />
      <StudentProfile student={student} searchParams={searchParams} />
    </DashboardShell>
  );
}

function StudentProfile({
  student,
  searchParams,
}: {
  student: User;
  searchParams: unknown;
}) {
  const page = getPageData(student.pageSlug);
  const { reading_time_level } =
    routes.student.$parseSearchParams(searchParams);
  let readingTimeLevel = ReadingTimeChartLevel.week_1;
  if (
    Object.values(ReadingTimeChartLevel).includes(
      reading_time_level as ReadingTimeChartLevel
    )
  ) {
    readingTimeLevel = reading_time_level as ReadingTimeChartLevel;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <p>{student.name}</p>
            <p className="text-sm font-semibold text-muted-foreground">
              {page?.title || firstAssignmentPage?.title}
            </p>
          </div>
        </CardTitle>
        <div className="space-y-4 text-muted-foreground">
          <div className="flex items-center justify-between">
            <p>{student.email}</p>
            <p>joined at {student.createdAt.toLocaleString("en-us")}</p>
          </div>
          <div className="text-center">
            <UserProgress
              pageSlug={student.pageSlug}
              finished={student.finished}
            />
          </div>

          <div className="flex justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              You are viewing a student in your class
            </p>
            <Link className={buttonVariants()} href="/dashboard/teacher">
              Back to all students
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserStatistics
          classId={student.classId}
          pageSlug={student.pageSlug}
          readingTimeLevel={readingTimeLevel}
        />
      </CardContent>
    </Card>
  );
}

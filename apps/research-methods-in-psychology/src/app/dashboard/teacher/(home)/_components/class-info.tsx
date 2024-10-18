import { Suspense } from "react";

import { getClassStudentsAction } from "@/actions/dashboard";
import { CreateErrorFallback } from "@/components/error-fallback";
import { Spinner } from "@/components/spinner";
import { TEXTBOOK_SLUG } from "@/config/site";
import { getPageData } from "@/lib/pages/pages.client";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { buttonVariants } from "@itell/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { Progress } from "@itell/ui/progress";
import { Skeleton } from "@itell/ui/skeleton";
import { median } from "@itell/utils";
import { ErrorBoundary } from "react-error-boundary";

import { ClassBadges } from "./class-badges";
import { ClassQuizTable } from "./quiz-table";
import { columns, type StudentData } from "./student-columns";
import { StudentsTable } from "./students-table";

const numChapters = allPagesSorted.length;

export async function ClassInfo({
  classId,
  userId,
}: {
  classId: string;
  userId: string;
}) {
  const [students, err] = await getClassStudentsAction({ classId });
  if (err) {
    throw new Error("failed to get students in the class", { cause: err });
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Class</CardTitle>
          <CardDescription>
            You have no students under class code{" "}
            <span className="font-semibold">{classId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Share this code with your students to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const studentData: StudentData[] = students.map((s) => {
    const page = getPageData(s.pageSlug);
    const progress = page
      ? {
          index: page.order,
          text: `${String(Math.round(((page.order + 1) / numChapters) * 100))}%`,
        }
      : { index: 0, text: "0%" };

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      createdAt: new Date(s.createdAt),
      progress,
      summaryCount: s.summaryCount,
    };
  });

  const classIndex = median(studentData.map((s) => s.progress.index)) ?? 0;
  const classProgress = ((classIndex + 1) / allPagesSorted.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Class</CardTitle>
        <CardDescription>
          {`You have ${String(students.length)} ${
            students.length > 1 ? "students" : "student"
          } under class code `}
          <span className="font-semibold">{classId}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <a
          rel="noreferrer"
          href={`
            https://ocular.cc.gatech.edu/itell?volume=${TEXTBOOK_SLUG}&uuid=${userId}`}
          className={buttonVariants({ variant: "secondary", size: "lg" })}
          target="_blank"
        >
          Detailed dashboard
        </a>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Median Class Statistics</h3>
          <Suspense fallback={<ClassBadges.Skeleton />}>
            <ErrorBoundary fallback={<ClassBadges.ErrorFallback />}>
              <ClassBadges
                students={students.map((student) => ({ id: student.id }))}
              />
            </ErrorBoundary>
          </Suspense>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <h3 className="col-span-1 text-lg font-medium">Median Progress</h3>
          <div className="col-span-1 flex items-center gap-4">
            <Progress value={classProgress} />
            <p className="shrink-0 text-muted-foreground">
              {classProgress.toFixed(2)}% completed
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="mb-4 text-lg font-medium">Quiz</h3>
          <ErrorBoundary fallback={<ClassQuizTable.ErrorFallback />}>
            <Suspense fallback={<ClassQuizTable.Skeleton />}>
              <ClassQuizTable
                students={students.map((s) => ({
                  id: s.id,
                  name: s.name ?? s.email ?? "Unknown",
                }))}
              />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="space-y-4">
          <h3 className="mb-4 text-lg font-medium">Student Statistics</h3>
          <StudentsTable columns={columns} data={studentData} />
        </div>
      </CardContent>
    </Card>
  );
}

ClassInfo.ErrorFallback = CreateErrorFallback(
  "Failed to get students in the class"
);

ClassInfo.Skeleton = function () {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Your Class</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Spinner className="size-4" /> Loading class details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="mb-4 text-lg font-medium">Median Class Statistics</h3>
        <ClassBadges.Skeleton />

        <h3 className="mb-4 text-lg font-medium">Median Class Progress</h3>
        <Skeleton className="h-8 w-96" />

        <h3 className="mb-4 text-lg font-medium">Student Statistics</h3>
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-12 w-64 rounded-md" />
          <Skeleton className="h-12 w-40 rounded-md" />
        </div>

        <Skeleton className="h-[300px] rounded-md" />
        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-12 w-28 rounded-md" />
          <Skeleton className="h-12 w-16 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

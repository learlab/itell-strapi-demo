import { getClassStudentsAction } from "@/actions/dashboard";
import { CreateErrorFallback } from "@/components/error-fallback";
import { Spinner } from "@/components/spinner";
import { allPagesSorted, firstPage } from "@/lib/pages";
import { getPageData, reportSentry } from "@/lib/utils";
import { median } from "@itell/core/utils";
import { Progress } from "@itell/ui/client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Skeleton,
} from "@itell/ui/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ClassBadges } from "./class-badges";
import { StudentData, columns } from "./student-columns";
import { StudentsTable } from "./students-table";

const numChapters = allPagesSorted.length;

export const ClassInfo = async ({ classId }: { classId: string }) => {
	const [students, err] = await getClassStudentsAction({ classId });
	if (err) {
		throw new Error(err.message);
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
						You have no students under this class code. Share this code with
						your students to get started.
					</p>
				</CardContent>
			</Card>
		);
	}

	const studentData: StudentData[] = students.map((s) => {
		const page = getPageData(s.pageSlug);
		const progress = page
			? {
					index: page.index,
					text: `${Math.round((page.index + 1) / numChapters) * 100}%`,
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

	const classIndex = median(studentData.map((s) => s.progress.index)) || 0;
	const classProgress = ((classIndex + 1) / allPagesSorted.length) * 100;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Class</CardTitle>
				<CardDescription>
					{`You have ${students.length} ${
						students.length > 1 ? "students" : "student"
					} under class code `}
					<span className="font-semibold">{classId}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<h3 className="mb-4 text-lg font-medium">Median Class Statistics</h3>
				<Suspense fallback={<ClassBadges.Skeleton />}>
					<ErrorBoundary fallback={<ClassBadges.ErrorFallback />}>
						<ClassBadges
							students={students.map((student) => ({ id: student.id }))}
						/>
					</ErrorBoundary>
				</Suspense>

				<h3 className="mb-4 text-lg font-medium mt-4">Median Progress</h3>
				<div className="flex items-center gap-4">
					<Progress value={classProgress} className="w-1/3" />
					<p className="text-muted-foreground">
						{classProgress.toFixed(2)}% completed
					</p>
				</div>

				<h3 className="mb-4 text-lg font-medium">Student Statistics</h3>
				<StudentsTable columns={columns} data={studentData} />
			</CardContent>
		</Card>
	);
};

ClassInfo.ErrorFallback = CreateErrorFallback(
	"Failed to get students in the class",
);

ClassInfo.Skeleton = () => (
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
			<Skeleton className="w-96 h-8" />

			<h3 className="mb-4 text-lg font-medium">Student Statistics</h3>
			<div className="flex items-center py-4 justify-between">
				<Skeleton className="rounded-md h-12 w-64" />
				<Skeleton className="rounded-md h-12 w-40 " />
			</div>

			<Skeleton className="rounded-md h-[300px]" />
			<div className="flex items-center justify-end space-x-2 py-4">
				<Skeleton className="rounded-md h-12 w-28" />
				<Skeleton className="rounded-md h-12 w-16" />
			</div>
		</CardContent>
	</Card>
);

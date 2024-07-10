import { Spinner } from "@/components/spinner";
import { getClassStudentStats } from "@/lib/dashboard/class";
import { allPagesSorted, firstPage } from "@/lib/pages";
import { getPageData } from "@/lib/utils";
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

export const ClassInfo = async ({ classId }: { classId: string }) => {
	const students = await getClassStudentStats(classId);
	const studentData: StudentData[] = students.map((s) => {
		const page = getPageData(s.pageSlug);
		let progress: StudentData["progress"];

		if (page) {
			progress = {
				index: page.index,
				text: page.title,
			};
		} else {
			progress = {
				index: 0,
				text: firstPage.title,
			};
		}

		return {
			id: s.id,
			name: s.name,
			email: s.email,
			createdAt: s.createdAt,
			progress,
			summaryCounts: s.summaryCount,
		};
	});

	studentData.sort((a, b) => a.progress.index - b.progress.index);
	const mid = Math.floor(studentData.length / 2);
	const classIndex =
		students.length % 2 !== 0
			? studentData[mid].progress.index
			: (studentData[mid - 1].progress.index +
					studentData[mid].progress.index) /
				2;

	const classProgress = (classIndex / allPagesSorted.length) * 100;

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

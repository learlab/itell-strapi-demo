import { Progress } from "@/components/client-components";
import { CreateErrorFallback } from "@/components/error-fallback";
import { StudentStats, getClassStudentStats } from "@/lib/dashboard";
import { allPagesSorted, firstPage } from "@/lib/pages";
import { delay, getPageData } from "@/lib/utils";
import { Skeleton } from "@itell/ui/server";
import { StudentData, columns } from "./students-columns";
import { StudentsTable } from "./students-table";

export const TeacherClassGeneral = async ({
	students,
}: { students: StudentStats }) => {
	const studentData: StudentData[] = students.map((s) => {
		const page = getPageData(s.pageSlug);
		let progress: StudentData["progress"];

		if (page) {
			progress = {
				chapter: page.chapter,
				index: page.index,
				title: page.title,
			};
		} else {
			progress = {
				chapter: firstPage.chapter,
				index: 0,
				title: firstPage.title,
			};
		}

		return {
			id: s.id,
			name: s.name,
			email: s.email,
			created_at: s.created_at,
			progress,
			summaryCounts: s._count.summaries,
		};
	});

	const classIndex = Math.floor(
		studentData.reduce((acc, student) => acc + student.progress.index, 0) /
			students.length,
	);

	const classProgress = (classIndex / allPagesSorted.length) * 100;

	return (
		<>
			<h3 className="mb-4 text-lg font-medium mt-4">Average Progress</h3>
			<div className="flex items-center gap-4">
				<Progress value={classProgress} className="w-1/3" />
				<p className="text-muted-foreground">
					{classProgress.toFixed(2)}% completed
				</p>
			</div>

			<h3 className="mb-4 text-lg font-medium">Student Statistics</h3>
			<StudentsTable columns={columns} data={studentData} />
		</>
	);
};

TeacherClassGeneral.Skeleton = () => (
	<>
		<h3 className="mb-4 text-lg font-medium">Average Class Progress</h3>
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
	</>
);

TeacherClassGeneral.ErrorFallback = CreateErrorFallback(
	"Failed to list students",
);

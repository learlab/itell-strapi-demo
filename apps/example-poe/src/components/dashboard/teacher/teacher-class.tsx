import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Skeleton,
} from "@itell/ui/server";
import { StudentsTable } from "./students-table";
import { StudentData, columns } from "./students-columns";
import { getClassStudentStats } from "@/lib/dashboard";
import { TeacherBadges } from "./teacher-badges";
import { Suspense } from "react";
import { allPagesSorted } from "@/lib/pages";
import { Progress } from "@/components/client-components";
import { PageData, getPageData } from "@/lib/utils";

export const TeacherClass = async ({ classId }: { classId: string }) => {
	const students = await getClassStudentStats(classId);
	const studentData: StudentData[] = students.map((s) => {
		const page = getPageData(s.pageSlug);
		let progress: StudentData["progress"];

		if (page) {
			progress = {
				chapter: page.chapter,
				section: page.section,
				index: page.index,
				title: page.title,
			};
		} else {
			progress = {
				chapter: 1,
				section: 1,
				index: 1,
				title: "What is Law",
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
		<Card>
			<CardHeader>
				<CardTitle>Your Class</CardTitle>
				<CardDescription>
					{`You have ${students.length} ${
						students.length > 1 ? "students" : "student"
					} under class code `}
					<span className="font-medium">{classId}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<h3 className="mb-4 text-lg font-medium">Average Class Statistics</h3>

				<Suspense fallback={<TeacherBadges.Skeleton />}>
					<TeacherBadges studentIds={students.map((student) => student.id)} />
				</Suspense>

				<h3 className="mb-4 text-lg font-medium mt-4">Average Progress</h3>
				<div className="flex items-center gap-4">
					<Progress value={classProgress} className="w-1/3" />
					<p className="text-muted-foreground">
						{classProgress.toFixed(2)}% completed
					</p>
				</div>

				<h3 className="mb-4 text-lg font-medium">All Students</h3>

				<StudentsTable columns={columns} data={studentData} />
			</CardContent>
		</Card>
	);
};

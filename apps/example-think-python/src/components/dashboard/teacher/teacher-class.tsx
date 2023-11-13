import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@itell/ui/server";
import { StudentsTable } from "./students-table";
import db from "@/lib/db";
import { StudentData, columns } from "./students-columns";
import { getClassStudentStats } from "@/lib/dashboard";
import { Suspense } from "react";
import { TeacherBadges } from "./teacher-badges";
import { UserProgress } from "../user/user-progress";
import { Progress } from "@/components/client-components";
import { allChapters } from "contentlayer/generated";
import pluralize from "pluralize";

export const TeacherClass = async ({ classId }: { classId: string }) => {
	const students = await getClassStudentStats(classId);

	const studentData: StudentData[] = students.map((s) => ({
		id: s.id,
		name: s.name,
		email: s.email,
		created_at: s.created_at,
		progress: s.chapter,
		summaryCounts: s._count.summaries,
	}));

	const classChapter = Math.floor(
		students.reduce((acc, student) => acc + student.chapter, 0) /
			students.length,
	);
	const classIndex = allChapters.findIndex(
		(chapter) => chapter.chapter === classChapter,
	);
	const classProgress = ((classIndex + 1) / allChapters.length) * 100;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Class</CardTitle>
				<CardDescription>
					{`You have ${pluralize(
						"student",
						students.length,
						true,
					)} under class code `}
					<span className="font-medium">{classId}</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<h3 className="mb-4 text-lg font-medium">Average Class Statistics</h3>
				<Suspense fallback={<TeacherBadges.Skeleton />}>
					<TeacherBadges studentIds={students.map((student) => student.id)} />
				</Suspense>

				<h3 className="mb-4 text-lg font-medium mt-4">Average Progress</h3>
				<div className="flex items-center gap-4">
					<Progress value={classProgress} className="w-1/3" />
					<p className="text-muted-foreground">
						{classProgress.toFixed(2)}% completed, {classIndex + 1}/
						{allChapters.length} chapters
					</p>
				</div>

				<h3 className="mb-4 text-lg font-medium mt-4">All Students</h3>

				<StudentsTable columns={columns} data={studentData} />
			</CardContent>
		</Card>
	);
};

import { getClassStudentStats } from "@/lib/dashboard";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@itell/ui/server";
import { Suspense } from "react";
import { TeacherBadges } from "./teacher-badges";
import { TeacherClassGeneral } from "./teacher-class-general";
import { TeacherClassQuiz } from "./teacher-class-quiz";

export const TeacherClass = async ({ classId }: { classId: string }) => {
	const students = await getClassStudentStats(classId);

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
				<h3 className="mb-4 text-lg font-medium">Average Class Statistics</h3>

				<Suspense fallback={<TeacherBadges.Skeleton />}>
					<TeacherBadges studentIds={students.map((student) => student.id)} />
				</Suspense>

				<Suspense fallback={<TeacherClassGeneral.Skeleton />}>
					<TeacherClassGeneral students={students} />
				</Suspense>

				<Suspense fallback={<TeacherClassQuiz.Skeleton />}>
					<TeacherClassQuiz students={students} />
				</Suspense>
			</CardContent>
		</Card>
	);
};

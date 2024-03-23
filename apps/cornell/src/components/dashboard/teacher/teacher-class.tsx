import { getClassStudentStats } from "@/lib/dashboard/class";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@itell/ui/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TeacherBadges } from "./teacher-badges";
import { TeacherClassGeneral } from "./teacher-class-general";

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
					<ErrorBoundary fallback={<TeacherBadges.ErrorFallback />}>
						<TeacherBadges studentIds={students.map((student) => student.id)} />
					</ErrorBoundary>
				</Suspense>

				<Suspense fallback={<TeacherClassGeneral.Skeleton />}>
					<ErrorBoundary fallback={<TeacherClassGeneral.ErrorFallback />}>
						<TeacherClassGeneral students={students} />
					</ErrorBoundary>
				</Suspense>
			</CardContent>
		</Card>
	);
};

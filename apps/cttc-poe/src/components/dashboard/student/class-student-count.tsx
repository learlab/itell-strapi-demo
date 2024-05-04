import { countStudent } from "@/lib/dashboard/class";
import pluralize from "pluralize";

export const ClassStudentCount = async ({ classId }: { classId: string }) => {
	const numStudents = await countStudent(classId);

	return <span>{pluralize("student", numStudents, true)}</span>;
};

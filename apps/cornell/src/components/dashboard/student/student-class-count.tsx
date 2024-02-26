import { getStudentsCount } from "@/lib/dashboard";
import pluralize from "pluralize";

export const StudentClassCount = async ({ classId }: { classId: string }) => {
	const numStudents = await getStudentsCount(classId);

	return <span>{pluralize("student", numStudents, true)}</span>;
};

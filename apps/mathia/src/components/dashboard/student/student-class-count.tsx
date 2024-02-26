import { getStudentsCount } from "@/lib/dashboard";

export const StudentClassCount = async ({ classId }: { classId: string }) => {
	const numStudents = getStudentsCount(classId);

	return <span>{numStudents}</span>;
};

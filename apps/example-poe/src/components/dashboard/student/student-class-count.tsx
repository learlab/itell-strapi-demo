import { getStudentsCount } from "@/lib/dashboard";
import Link from "next/link";
import pluralize from "pluralize";

export const StudentClassCount = async ({ classId }: { classId: string }) => {
	const numStudents = await getStudentsCount(classId);

	return (
		<Link className="font-semibold underline" href={"/dashboard/class"}>{` ${
			numStudents - 1
		} fellow ${pluralize(
			"student",
			numStudents - 1, // exclude current user
		)}`}</Link>
	);
};

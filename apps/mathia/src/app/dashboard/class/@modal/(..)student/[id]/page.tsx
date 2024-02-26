import { ReadingTime } from "@/components/dashboard/reading-time";
import { StudentBadges } from "@/components/dashboard/student/student-badges";
import { StudentDetailsModal } from "@/components/dashboard/student/student-details-modal";
import { getUser } from "@/lib/user";
import { ReadingTimeChartLevel } from "@itell/core/types";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	params: {
		id: string;
	};
};

export default async function ({ params }: Props) {
	const { id } = params;
	const student = await getUser(id);

	if (!student) {
		return <p>student not found</p>;
	}

	return (
		<StudentDetailsModal student={student}>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StudentBadges user={student} />
			</div>
			<ReadingTime
				uid={student.id}
				params={{ level: ReadingTimeChartLevel.week_1 }}
				name={student.name || "The user"}
			/>
		</StudentDetailsModal>
	);
}

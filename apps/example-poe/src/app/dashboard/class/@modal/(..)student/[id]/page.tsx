import { ReadingTime } from "@/components/dashboard/reading-time";
import { StudentBadges } from "@/components/dashboard/student/student-badges";
import { StudentDetailsModal } from "@/components/dashboard/student/student-details-modal";
import { StudentProfile } from "@/components/dashboard/student/student-profile";
import { UserStatistics } from "@/components/dashboard/user-statistics";
import { UserStatisticsControl } from "@/components/dashboard/user-statistics-control";
import { getUserWithClass } from "@/lib/dashboard";
import { getUser } from "@/lib/user";
import {
	ReadingTimeChartLevel,
	ReadingTimeChartParams,
} from "@itell/core/types";

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

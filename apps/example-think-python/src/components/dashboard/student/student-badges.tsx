import {
	FileTextIcon,
	FlagIcon,
	PencilIcon,
	WholeWordIcon,
} from "lucide-react";
import { User } from "@prisma/client";
import { getClassStudents, getSummaryStats } from "@/lib/dashboard";
import { DashboardBadge } from "@itell/ui/server";

export const StudentBadges = async ({ user }: { user: User }) => {
	const students = await getClassStudents(user.classId as string);
	const studentStats = await getSummaryStats({
		where: {
			userId: user.id,
		},
	});
	const otherStats = await getSummaryStats({
		where: {
			userId: {
				in: students.map((student) => student.id),
				not: user.id,
			},
		},
	});

	const comparisons = {
		totalCount:
			studentStats.totalCount - otherStats.totalCount / students.length,
		passedCount:
			studentStats.passedCount - otherStats.passedCount / students.length,
		avgContentScore:
			studentStats.avgContentScore && otherStats.avgContentScore
				? studentStats.avgContentScore - otherStats.avgContentScore
				: null,
		avgWordingScore:
			studentStats.avgWordingScore && otherStats.avgWordingScore
				? studentStats.avgWordingScore - otherStats.avgWordingScore
				: null,
	};

	return (
		<>
			<DashboardBadge
				className={
					comparisons.totalCount > 0 ? "border-info" : "border-destructive"
				}
				title="Total Summaries"
				value={studentStats.totalCount}
				description={comparisons.totalCount}
				comparing
				icon={<PencilIcon className="w-4 h-4 text-muted-foreground" />}
			/>
			<DashboardBadge
				className={
					comparisons.passedCount > 0 ? "border-info" : "border-destructive"
				}
				title="Passed Summaries"
				value={studentStats.passedCount}
				description={comparisons.passedCount}
				comparing
				icon={<FlagIcon className="w-4 h-4 text-muted-foreground" />}
			/>
			<DashboardBadge
				className={
					comparisons.avgContentScore && comparisons.avgContentScore > 0
						? "border-info"
						: "border-destructive"
				}
				title="Average Content Score"
				value={studentStats.avgContentScore}
				description={comparisons.avgContentScore}
				comparing
				icon={<FileTextIcon className="w-4 h-4 text-muted-foreground" />}
			/>
			<DashboardBadge
				className={
					comparisons.avgWordingScore && comparisons.avgWordingScore > 0
						? "border-info"
						: "border-destructive"
				}
				title="Average Wording Score"
				value={studentStats.avgWordingScore}
				description={comparisons.avgWordingScore}
				comparing
				icon={<WholeWordIcon className="w-4 h-4 text-muted-foreground" />}
			/>
		</>
	);
};

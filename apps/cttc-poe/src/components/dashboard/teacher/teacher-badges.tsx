import { CreateErrorFallback } from "@/components/error-fallback";
import { getBadgeStats, getClassBadgeStats } from "@/lib/dashboard";
import { DashboardBadge } from "@itell/ui/server";
import {
	FileTextIcon,
	FlagIcon,
	PencilIcon,
	WholeWordIcon,
} from "lucide-react";

type Props = {
	students: Array<{ id: string }>;
};

export const TeacherBadges = async ({ students }: Props) => {
	const classSummaryStats = await getClassBadgeStats(students);

	const classStats = {
		avgTotalCount: classSummaryStats.totalCount / students.length,
		avgPassedCount: classSummaryStats.passedCount / students.length,
		avgWordingScore: classSummaryStats.avgWordingScore,
		avgContentScore: classSummaryStats.avgContentScore,
		constructedResponseCount:
			classSummaryStats.totalConstructedResponses / students.length,
		passedConstructedResponseCount:
			classSummaryStats.passedConstructedResponses / students.length,
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<DashboardBadge title="Total Summaries" icon={<PencilIcon />}>
				<div className="text-2xl font-bold">
					{classStats.avgTotalCount.toFixed(2)}
				</div>
			</DashboardBadge>
			<DashboardBadge title="Passed Summaries" icon={<FlagIcon />}>
				<div className="text-2xl font-bold">
					{classStats.avgPassedCount.toFixed(2)}
				</div>
			</DashboardBadge>
			<DashboardBadge title="Average Content Score" icon={<FileTextIcon />}>
				<div className="text-2xl font-bold">
					{classStats.avgContentScore?.toFixed(2)}
				</div>
			</DashboardBadge>
			<DashboardBadge title="Average Wording Score" icon={<WholeWordIcon />}>
				<div className="text-2xl font-bold">
					{classStats.avgWordingScore?.toFixed(2)}
				</div>
			</DashboardBadge>
			<DashboardBadge title="Total Constructed Responses" icon={<PencilIcon />}>
				<div className="text-2xl font-bold">
					{classStats.constructedResponseCount}
				</div>
			</DashboardBadge>
			<DashboardBadge title="Passed Constructed Responses" icon={<FlagIcon />}>
				<div className="text-2xl font-bold">
					{classStats.passedConstructedResponseCount}
				</div>
			</DashboardBadge>
		</div>
	);
};

TeacherBadges.Skeleton = () => (
	<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<DashboardBadge.Skeletons />
	</div>
);

TeacherBadges.ErrorFallback = CreateErrorFallback(
	"Failed to calculate class statistics",
);

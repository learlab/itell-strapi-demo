import {
	FileTextIcon,
	FlagIcon,
	PencilIcon,
	WholeWordIcon,
} from "lucide-react";
import { getSummaryStats } from "@/lib/dashboard";
import { DashboardBadge } from "@itell/ui/server";

type Props = {
	studentIds: string[];
};

export const TeacherBadges = async ({ studentIds }: Props) => {
	const classSummaryStats = await getSummaryStats({
		where: {
			userId: {
				in: studentIds,
			},
		},
	});

	const classStats = {
		avgTotalCount: classSummaryStats.totalCount / studentIds.length,
		avgPassedCount: classSummaryStats.passedCount / studentIds.length,
		avgWordingScore: classSummaryStats.avgWordingScore,
		avgContentScore: classSummaryStats.avgContentScore,
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<DashboardBadge
				title="Average Submitted Summaries"
				value={classStats.avgTotalCount}
				icon={<PencilIcon className="size-4 text-muted-foreground" />}
			/>
			<DashboardBadge
				title="Average Passed Summaries"
				value={classStats.avgPassedCount}
				icon={<FlagIcon className="size-4 text-muted-foreground" />}
			/>
			<DashboardBadge
				title="Average Content Score"
				value={classStats.avgContentScore}
				icon={<FileTextIcon className="size-4 text-muted-foreground" />}
			/>
			<DashboardBadge
				title="Average Wording Score"
				value={classStats.avgWordingScore}
				icon={<WholeWordIcon className="size-4 text-muted-foreground" />}
			/>
		</div>
	);
};

TeacherBadges.Skeleton = () => (
	<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<DashboardBadge.Skeletons />
	</div>
);

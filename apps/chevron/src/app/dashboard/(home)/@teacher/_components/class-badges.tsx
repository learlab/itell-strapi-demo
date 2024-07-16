import { CreateErrorFallback } from "@/components/error-fallback";
import { getOtherStats } from "@/lib/dashboard";
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

export const ClassBadges = async ({ students }: Props) => {
	const classStats = await getOtherStats(students);

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<DashboardBadge title="Total Summaries" icon={<PencilIcon />}>
				<div className="text-2xl font-bold">{classStats.totalSummaries}</div>
			</DashboardBadge>
			<DashboardBadge title="Passed Summaries" icon={<FlagIcon />}>
				<div className="text-2xl font-bold">
					{classStats.totalPassedSummaries}
				</div>
			</DashboardBadge>
			<DashboardBadge title="Content Score" icon={<FileTextIcon />}>
				<div className="text-2xl font-bold">
					{classStats.contentScore ? classStats.contentScore.toFixed(2) : "NA"}
				</div>
			</DashboardBadge>
			<DashboardBadge title="Language Score" icon={<WholeWordIcon />}>
				<div className="text-2xl font-bold">
					{classStats.languageScore
						? classStats.languageScore.toFixed(2)
						: "NA"}
				</div>
			</DashboardBadge>
			<DashboardBadge title="Answers" icon={<PencilIcon />}>
				<div className="text-2xl font-bold">{classStats.totalAnswers}</div>
			</DashboardBadge>
			<DashboardBadge title="Correct Answers" icon={<FlagIcon />}>
				<div className="text-2xl font-bold">
					{classStats.totalPassedAnswers}
				</div>
			</DashboardBadge>
		</div>
	);
};

ClassBadges.Skeleton = () => (
	<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<DashboardBadge.Skeletons />
	</div>
);

ClassBadges.ErrorFallback = CreateErrorFallback(
	"Failed to calculate class statistics",
);

import {
	FileTextIcon,
	FlagIcon,
	PencilIcon,
	WholeWordIcon,
} from "lucide-react";
import { getSummaryStats } from "@/lib/dashboard";
import { DashboardBadge } from "@itell/ui/server";

export const UserBadges = async ({ uid }: { uid: string }) => {
	const summaryStats = await getSummaryStats({
		where: {
			userId: uid,
		},
	});
	return (
		<>
			<DashboardBadge
				title="Total Summaries"
				value={summaryStats.totalCount}
				icon={<PencilIcon className="size-4 text-muted-foreground" />}
			/>
			<DashboardBadge
				title="Passed Summaries"
				value={summaryStats.passedCount}
				icon={<FlagIcon className="size-4 text-muted-foreground" />}
			/>
			<DashboardBadge
				title="Average Content Score"
				value={summaryStats.avgContentScore}
				icon={<FileTextIcon className="size-4 text-muted-foreground" />}
			/>
			<DashboardBadge
				title="Average Wording Score"
				value={summaryStats.avgWordingScore}
				icon={<WholeWordIcon className="size-4 text-muted-foreground" />}
			/>
		</>
	);
};

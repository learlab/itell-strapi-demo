import { CreateErrorFallback } from "@/components/error-fallback";
import { getSummaryStats } from "@/lib/summary";
import { DashboardBadge } from "@itell/ui/server";
import {
	FileTextIcon,
	FlagIcon,
	PencilIcon,
	WholeWordIcon,
} from "lucide-react";

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

UserBadges.ErrorFallback = CreateErrorFallback(
	"Failed to calculate learning statistics",
);

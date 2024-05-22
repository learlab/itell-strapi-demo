import { CreateErrorFallback } from "@/components/error-fallback";
import { getBadgeStats } from "@/lib/dashboard";
import { DashboardBadge } from "@itell/ui/server";
import {
	FileTextIcon,
	FlagIcon,
	LightbulbIcon,
	MessageCircleQuestionIcon,
	PencilIcon,
	WholeWordIcon,
} from "lucide-react";

const roundNumber = (num: number | null) => {
	if (num === null) {
		return "NA";
	}

	return Number.isInteger(num) ? num : Number(num.toFixed(2));
};

export const UserBadges = async ({ userId }: { userId: string }) => {
	const {
		totalCount,
		totalCountLastWeek,
		passedCount,
		passedCountLastWeek,
		totalConstructedResponses,
		totalConstructedResponsesLastWeek,
		passedConstructedResponses,
		passedConstructedResponsesLastWeek,
		avgContentScore,
		avgWordingScore,
		avgContentScoreLastWeek,
		avgWordingScoreLastWeek,
	} = await getBadgeStats(userId);
	return (
		<>
			<DashboardBadge
				title="Total Summaries"
				icon={<PencilIcon className="size-4" />}
			>
				<div className="text-2xl font-bold">{totalCount}</div>
				<p className="text-xs text-muted-foreground">
					{totalCountLastWeek} from last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Passed Summaries"
				icon={<FlagIcon className="size-4" />}
			>
				<div className="text-2xl font-bold">{passedCount}</div>
				<p className="text-xs text-muted-foreground">
					{passedCountLastWeek} from last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Average Content Score"
				icon={<FileTextIcon className="size-4" />}
			>
				<div className="text-2xl font-bold">{roundNumber(avgContentScore)}</div>
				<p className="text-xs text-muted-foreground">
					{roundNumber(avgContentScoreLastWeek)} last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Average Wording Score"
				icon={<WholeWordIcon className="size-4" />}
			>
				<div className="text-2xl font-bold">{roundNumber(avgWordingScore)}</div>
				<p className="text-xs text-muted-foreground">
					{roundNumber(avgWordingScoreLastWeek)} last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Total Questions"
				icon={<MessageCircleQuestionIcon className="size-4" />}
			>
				<div className="text-2xl font-bold">{totalConstructedResponses}</div>
				<p className="text-xs text-muted-foreground">
					{totalConstructedResponsesLastWeek} from last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Passed Questions"
				icon={<LightbulbIcon className="size-4" />}
			>
				<div className="text-2xl font-bold">{passedConstructedResponses}</div>
				<p className="text-xs text-muted-foreground">
					{passedConstructedResponsesLastWeek} from last week
				</p>
			</DashboardBadge>
		</>
	);
};

UserBadges.ErrorFallback = CreateErrorFallback(
	"Failed to calculate learning statistics",
);

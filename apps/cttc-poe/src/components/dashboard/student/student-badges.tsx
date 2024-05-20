import { getBadgeStats, getClassBadgeStats } from "@/lib/dashboard";
import { getClassStudents } from "@/lib/dashboard/class";
import { cn } from "@itell/core/utils";
import { DashboardBadge } from "@itell/ui/server";
import {
	FileTextIcon,
	FlagIcon,
	LightbulbIcon,
	MessageCircleQuestionIcon,
	PencilIcon,
	WholeWordIcon,
} from "lucide-react";

export const StudentBadges = async ({
	userId,
	classId,
}: { userId: string; classId: string }) => {
	const students = await getClassStudents(classId);
	const [studentStats, otherStats] = await Promise.all([
		getBadgeStats(userId),
		getClassBadgeStats(students),
	]);

	const comparisons = {
		totalCount:
			studentStats.totalCount - otherStats.totalCount / students.length,
		passedCount:
			studentStats.passedCount - otherStats.passedCount / students.length,
		constructedResponseCount:
			studentStats.totalConstructedResponses -
			otherStats.totalConstructedResponses,
		passedConstructedResponseCount:
			studentStats.passedConstructedResponses -
			otherStats.passedConstructedResponses,
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
				title="Total Summaries"
				icon={<PencilIcon className="size-4" />}
				className={cn({
					"border-green-500": comparisons.totalCount > 0,
					"border-destructive": comparisons.totalCount < 0,
				})}
			>
				<div className="text-2xl font-bold">{studentStats.totalCount}</div>
				<p className="text-xs text-muted-foreground">
					{comparisons.totalCount > 0 ? "+" : ""}
					{Math.round(comparisons.totalCount)} compared to class
				</p>
				<p className="text-xs text-muted-foreground">
					{studentStats.totalCountLastWeek} from last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Passed Summaries"
				icon={<FlagIcon className="size-4" />}
				className={cn({
					"border-green-500": comparisons.passedCount > 0,
					"border-destructive": comparisons.passedCount < 0,
				})}
			>
				<div className="text-2xl font-bold">{studentStats.passedCount}</div>
				<p className="text-xs text-muted-foreground">
					{comparisons.passedCount > 0 ? "+" : ""}
					{Math.round(comparisons.passedCount)} compared to class
				</p>
				<p className="text-xs text-muted-foreground">
					{studentStats.passedCountLastWeek} from last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Average Content Score"
				icon={<FileTextIcon className="size-4" />}
				className={cn({
					"border-green-500":
						comparisons.avgContentScore && comparisons.avgContentScore > 0,
					"border-destructive":
						comparisons.avgContentScore && comparisons.avgContentScore < 0,
				})}
			>
				<div className="text-2xl font-bold">
					{Number.isNaN(studentStats.avgContentScore)
						? "NA"
						: studentStats.avgContentScore.toFixed(2)}
				</div>
				<p className="text-xs text-muted-foreground">
					{comparisons.avgContentScore
						? `
					${
						comparisons.avgContentScore > 0 ? "+" : ""
					}${comparisons.avgContentScore.toFixed(2)} compared to class`
						: "class stats unavailable"}
				</p>
				<p className="text-xs text-muted-foreground">
					{studentStats.avgContentScoreLastWeek.toFixed(2)} last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Average Wording Score"
				icon={<WholeWordIcon className="size-4" />}
				className={cn({
					"border-green-500":
						comparisons.avgWordingScore && comparisons.avgWordingScore > 0,
					"border-destructive":
						comparisons.avgWordingScore && comparisons.avgWordingScore < 0,
				})}
			>
				<div className="text-2xl font-bold">
					{Number.isNaN(studentStats.avgWordingScore)
						? "NA"
						: studentStats.avgWordingScore.toFixed(2)}
				</div>
				<p className="text-xs text-muted-foreground">
					{comparisons.avgWordingScore
						? `
					${
						comparisons.avgWordingScore > 0 ? "+" : ""
					}${comparisons.avgWordingScore.toFixed(2)} compared to class`
						: "class stats unavailable"}
				</p>
				<p className="text-xs text-muted-foreground">
					{studentStats.avgWordingScoreLastWeek.toFixed(2)} last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Total Questions"
				icon={<MessageCircleQuestionIcon className="size-4" />}
				className={cn({
					"border-green-500": comparisons.constructedResponseCount > 0,
					"border-destructive": comparisons.constructedResponseCount < 0,
				})}
			>
				<div className="text-2xl font-bold">
					{studentStats.totalConstructedResponses}
				</div>
				<p className="text-xs text-muted-foreground">
					{comparisons.constructedResponseCount > 0 ? "+" : ""}
					{comparisons.constructedResponseCount} compared to class
				</p>
				<p className="text-xs text-muted-foreground">
					{studentStats.totalConstructedResponsesLastWeek} from last week
				</p>
			</DashboardBadge>
			<DashboardBadge
				title="Passed Questions"
				icon={<LightbulbIcon className="size-4" />}
				className={cn({
					"border-green-500": comparisons.passedConstructedResponseCount > 0,
					"border-destructive": comparisons.passedConstructedResponseCount < 0,
				})}
			>
				<div className="text-2xl font-bold">
					{studentStats.passedConstructedResponses}
				</div>
				<p className="text-xs text-muted-foreground">
					{comparisons.passedConstructedResponseCount > 0 ? "+" : ""}
					{comparisons.passedConstructedResponseCount} compared to class
				</p>
				<p className="text-xs text-muted-foreground">
					{studentStats.passedConstructedResponsesLastWeek} from last week
				</p>
			</DashboardBadge>
		</>
	);
};

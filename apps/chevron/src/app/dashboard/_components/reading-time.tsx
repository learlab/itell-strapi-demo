import { countSummaryAction, getReadingTimeAction } from "@/actions/dashboard";
import { CreateErrorFallback } from "@/components/error-fallback";
import { PrevDaysLookup, getReadingTimeChartData } from "@itell/core/dashboard";
import { ReadingTimeChartParams } from "@itell/core/dashboard";
import { getDatesBetween } from "@itell/core/utils";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@itell/ui/client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Skeleton,
} from "@itell/ui/server";
import { format, subDays } from "date-fns";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { ReadingTimeChart } from "./reading-time-chart";
import { ReadingTimeControl } from "./reading-time-control";

type Props = {
	userId: string;
	params: ReadingTimeChartParams;
	name?: string;
};

export const ReadingTime = async ({ userId, params, name }: Props) => {
	const startDate = subDays(new Date(), PrevDaysLookup[params.level]);
	const intervalDates = getDatesBetween(startDate, new Date());
	const [[summaryCount, err1], [readingTimeGrouped, err2]] = await Promise.all([
		countSummaryAction({ userId, startDate }),
		getReadingTimeAction({ userId, startDate, intervalDates }),
	]);

	if (err1 || err2) {
		throw new Error();
	}

	const { totalViewTime, chartData } = getReadingTimeChartData(
		readingTimeGrouped,
		intervalDates,
		params,
	);
	return (
		<Card className="has-[[data-pending]]:animate-pulse">
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between">
						<HoverCard>
							<HoverCardTrigger asChild>
								<Button
									variant="link"
									size="lg"
									className="pl-0 text-lg xl:text-xl flex items-center gap-1"
								>
									Total Reading Time
									<InfoIcon className="size-4" />
								</Button>
							</HoverCardTrigger>
							<HoverCardContent>
								<p className="text-sm font-semibold">
									Measures how long a user has stayed in all textbook pages, in
									minutes
								</p>
							</HoverCardContent>
						</HoverCard>
						<ReadingTimeControl />
					</div>
				</CardTitle>
				<CardDescription>
					{name ? name : "You"} spent {Math.round(totalViewTime / 60)} minutes
					reading the textbook, wrote {""}
					<Link className="font-semibold underline" href="/dashboard/summaries">
						{pluralize("summary", summaryCount, true)}
					</Link>{" "}
					during{" "}
					{`${format(startDate, "LLL, dd")}-${format(new Date(), "LLL, dd")}`}
				</CardDescription>
			</CardHeader>
			<CardContent className="pl-2 space-y-2">
				<ReadingTimeChart data={chartData} />
			</CardContent>
		</Card>
	);
};

ReadingTime.Skeleton = () => <Skeleton className="w-full h-[350px]" />;
ReadingTime.ErrorFallback = CreateErrorFallback(
	"Failed to calculate total reading time",
);

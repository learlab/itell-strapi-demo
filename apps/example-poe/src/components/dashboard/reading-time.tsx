import db from "@/lib/db";
import {
	PrevDaysLookup,
	ReadingTimeEntry,
	getGroupedReadingTime,
	getReadingTimeChartData,
} from "@itell/core/dashboard";
import { ReadingTimeChartParams } from "@itell/core/types";
import { getDatesBetween } from "@itell/core/utils";
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
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../client-components";
import { ReadingTimeChart } from "./reading-time-chart";

type Props = {
	uid: string;
	params: ReadingTimeChartParams;
	name?: string;
};

const getSummaryCounts = async (uid: string, startDate: Date) => {
	return db.summary.count({
		where: {
			userId: uid,
			created_at: {
				gte: startDate,
			},
		},
	});
};

const getReadingTime = async (
	uid: string,
	startDate: Date,
	intervalDates: Date[],
) => {
	const records = await db.$queryRaw`
		SELECT sum(d.value::integer)::integer as total_view_time, created_at::date
		FROM focus_times, jsonb_each(data) d
		WHERE created_at >= ${startDate} and user_id = ${uid}
		GROUP BY created_at::date
	`;
	const readingTimeGrouped = await getGroupedReadingTime(
		records as ReadingTimeEntry[],
		intervalDates,
	);
	return readingTimeGrouped;
};

export const ReadingTime = async ({ uid, params, name }: Props) => {
	const startDate = subDays(new Date(), PrevDaysLookup[params.level]);
	const intervalDates = getDatesBetween(startDate, new Date());
	const [summaryCounts, readingTimeGrouped] = await Promise.all([
		getSummaryCounts(uid, startDate),
		getReadingTime(uid, startDate, intervalDates),
	]);

	const { totalViewTime, chartData } = getReadingTimeChartData(
		readingTimeGrouped,
		intervalDates,
		params,
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<HoverCard>
						<HoverCardTrigger asChild>
							<Button
								variant="link"
								size="lg"
								className="pl-0 text-lg flex items-center gap-1"
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
				</CardTitle>
				<CardDescription>
					{name ? name : "You"} spent {(totalViewTime / 60).toFixed(2)} minutes
					reading the textbook, wrote {""}
					<Link className="font-semibold underline" href="/dashboard/summaries">
						{pluralize("summary", summaryCounts, true)}
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

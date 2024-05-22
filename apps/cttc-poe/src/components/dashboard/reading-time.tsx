import { focus_times, summaries } from "@/drizzle/schema";
import { db, first } from "@/lib/db";
import {
	PrevDaysLookup,
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
import { and, count, eq, gte, sql } from "drizzle-orm";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { BarChart } from "../chart/bar-chart";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../client-components";
import { CreateErrorFallback } from "../error-fallback";
import { ReadingTimeControl } from "./reading-time-control";

type Props = {
	userId: string;
	params: ReadingTimeChartParams;
	name?: string;
};

const getSummaryCounts = async (userId: string, startDate: Date) => {
	const record = first(
		await db
			.select({
				count: count(),
			})
			.from(summaries)
			.where(
				and(eq(summaries.userId, userId), gte(summaries.createdAt, startDate)),
			),
	);

	return record?.count || 0;
};

const getReadingTime = async (
	userId: string,
	startDate: Date,
	intervalDates: Date[],
) => {
	// TODO: fix this query or how we store focus time data
	// for records created before start date, they can still be updated
	// but this won't be reflected in the reading time
	const dataExpanded = db.$with("expanded").as(
		db
			.select({
				value: sql`(jsonb_each(${focus_times.data})).value`.as("value"),
				createdAt: sql<Date>`${focus_times.createdAt}::date`.as("createdAt"),
			})
			.from(focus_times)
			.where(
				and(
					eq(focus_times.userId, userId),
					gte(focus_times.createdAt, startDate),
				),
			),
	);

	const records = await db
		.with(dataExpanded)
		.select({
			totalViewTime: sql<number>`sum(value::integer)::integer`.as(
				"totalViewTime",
			),
			createdAt: dataExpanded.createdAt,
		})
		.from(dataExpanded)
		.groupBy(dataExpanded.createdAt);

	const readingTimeGrouped = await getGroupedReadingTime(
		records,
		intervalDates,
	);
	return readingTimeGrouped;
};

export const ReadingTime = async ({ userId: uid, params, name }: Props) => {
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
		<Card className="has-[[data-pending]]:animate-pulse">
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between">
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
						<ReadingTimeControl />
					</div>
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
				<BarChart data={chartData} unit="min" />
			</CardContent>
		</Card>
	);
};

ReadingTime.Skeleton = () => <Skeleton className="w-full h-[350px]" />;
ReadingTime.ErrorFallback = CreateErrorFallback(
	"Failed to calculate total reading time",
);

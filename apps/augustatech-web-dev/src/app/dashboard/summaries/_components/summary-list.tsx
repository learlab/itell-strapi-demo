"use client";
import { Summary } from "@/drizzle/schema";
import { DEFAULT_TIME_ZONE } from "@/lib/constants";
import { cn, keyof, relativeDate } from "@itell/core/utils";
import { Skeleton, buttonVariants } from "@itell/ui/server";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { useState } from "react";
import { ChapterSelect } from "./chapter-select";

type SummaryData = Summary & { pageTitle: string };

export const SummaryList = ({
	userTimeZone,
	summariesByChapter,
}: {
	summariesByChapter: Record<string, SummaryData[]>;
	userTimeZone: string | null;
}) => {
	const chapters = keyof(summariesByChapter);
	const [selectedChapter, setSelectedChapter] = useState(chapters[0]);
	const chapterSummaries = summariesByChapter[selectedChapter];
	return (
		<div className="spacey-4">
			<div className="flex items-center justify-between">
				<ChapterSelect
					chapters={chapters}
					value={selectedChapter}
					onValueChange={(val) => setSelectedChapter(val)}
				/>
				<p className="text-muted-foreground text-sm">
					{`${pluralize("summary", chapterSummaries.length, true)}`}
				</p>
			</div>

			<ol className="divide-y divide-border rounded-md border mt-4">
				{chapterSummaries.map((summary) => (
					<SummaryItem
						summary={summary}
						key={summary.id}
						timeZone={userTimeZone || DEFAULT_TIME_ZONE}
					/>
				))}
			</ol>
		</div>
	);
};

interface SummaryItemProps {
	summary: SummaryData;
	timeZone: string;
}

export const SummaryItem = ({ summary, timeZone }: SummaryItemProps) => {
	return (
		<Link
			href={`/summary/${summary.id}`}
			className={cn(
				buttonVariants({ variant: "ghost", className: "h-fit" }),
				"block p-4",
			)}
			aria-label="user summary"
		>
			<header className="flex flex-col text-sm text-muted-foreground">
				<p className="font-semibold text-lg leading-relaxed ">
					{summary.pageTitle}
				</p>

				<p>{relativeDate(summary.createdAt, timeZone)}</p>
			</header>
			<div className="flex items-center justify-between">
				<p className="line-clamp-2">{summary.text}</p>
				{summary.isPassed ? (
					<CheckCircle className="size-4 stroke-info" />
				) : (
					<XCircle className="size-4 stroke-warning" />
				)}
			</div>
		</Link>
	);
};

export const SummaryItemSkeleton = () => (
	<div className="p-4">
		<div className="space-y-3">
			<Skeleton className="h-5 w-2/5" />
			<Skeleton className="h-4 w-4/5" />
		</div>
	</div>
);

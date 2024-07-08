"use client";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/client-components";
import { Summary } from "@/drizzle/schema";
import { DEFAULT_TIME_ZONE } from "@/lib/constants";
import { keyof } from "@itell/core/utils";
import pluralize from "pluralize";
import { useState } from "react";
import { SummaryItem } from "./summary-item";

const SelectChapter = ({
	chapters,
	...rest
}: { chapters: string[] } & React.ComponentProps<typeof Select>) => {
	return (
		<Select {...rest}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Chapter" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Select a chapter</SelectLabel>
					{chapters.map((c) => (
						<SelectItem key={c} value={c}>
							Chapter {Number(c)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export type SummaryData = Summary & { pageTitle: string };

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
		<div className="p-4 ">
			<div className="flex items-center justify-between">
				<SelectChapter
					chapters={chapters}
					value={selectedChapter}
					onValueChange={(val) => setSelectedChapter(val)}
				/>
				<p className="text-muted-foreground text-sm">
					{`${pluralize("summary", chapterSummaries.length, true)}`}
				</p>
			</div>

			<div className="divide-y divide-border rounded-md border mt-4 w-[960px]">
				{chapterSummaries.map((summary) => (
					<SummaryItem
						summary={summary}
						key={summary.id}
						timeZone={userTimeZone || DEFAULT_TIME_ZONE}
					/>
				))}
			</div>
		</div>
	);
};

import { getConstructedResponse } from "@/lib/constructed-response";
import db from "@/lib/db";
import { getPageData } from "@/lib/utils";
import { cn, groupby } from "@itell/core/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Skeleton,
} from "@itell/ui/server";
import { FrownIcon, LaughIcon, LightbulbIcon, MehIcon } from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { BarChart } from "../chart/bar-chart";
import { CreateErrorFallback } from "../error-fallback";
import { PageLink } from "../page/page-link";

type Props = {
	uid: string;
};

export const getConstructedResponseScore = async (uid: string) => {
	return await db.constructedResponse.groupBy({
		by: ["score"],
		_count: true,
		where: {
			userId: uid,
		},
	});
};

export const ConstructedResponse = async ({ uid }: Props) => {
	const [records, byScore] = await Promise.all([
		getConstructedResponse(uid),
		getConstructedResponseScore(uid),
	]);
	const byChapter = groupby(records, (d) => d.pageSlug);
	const chapters = Object.keys(byChapter)
		.map((k) => getPageData(k))
		.filter(Boolean);
	chapters.sort((a, b) => a.chapter - b.chapter);
	const chartData = byScore.map((s) => ({
		name:
			s.score === 2 ? "Excellent" : s.score === 1 ? "Medium" : "Not passing",
		value: s._count,
	}));

	return (
		<>
			<div className="p-4">
				<p className="text-muted-foreground">
					{records.length} questions was answered in total
				</p>
			</div>
			<BarChart
				data={chartData}
				yAxisOptions={{ allowDecimals: false }}
				addLabel
			/>
			<Card>
				<CardHeader>
					<CardTitle>All Records</CardTitle>
					<CardDescription>
						Due to randomness in question placement, you may not receive the
						same question set for a chapter{" "}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8 divide-y divide-border">
					{chapters.map((chapter) => {
						const answers = byChapter[chapter.page_slug];
						const excellentAnswers = answers.filter((a) => a.score === 2);
						return (
							<div key={chapter.index} className="space-y-4 pt-4">
								<header>
									<p className={cn("font-semibold text-xl text-pretty")}>
										{chapter.title}
									</p>
									<p className="text-muted-foreground">
										{pluralize("answer", answers.length, true)},{" "}
										{excellentAnswers.length} excellent
									</p>
								</header>
								{answers.map((a) => (
									<div
										key={a.id}
										className="flex items-baseline justify-between gap-4"
									>
										<PageLink
											pageSlug={a.pageSlug}
											chunkSlug={a.chunkSlug}
											className="flex-1 flex items-baseline gap-2 hover:underline"
										>
											<LightbulbIcon className="size-4" />
											<p className="flex-1">{a.response}</p>
										</PageLink>
										{a.score === 0 ? (
											<FrownIcon />
										) : a.score === 1 ? (
											<MehIcon />
										) : (
											<LaughIcon />
										)}
									</div>
								))}
							</div>
						);
					})}
				</CardContent>
			</Card>
		</>
	);
};

ConstructedResponse.Skeleton = () => <Skeleton className="w-full h-[200px]" />;
ConstructedResponse.ErrorFallback = CreateErrorFallback(
	"Failed to display question-answering statistics",
);

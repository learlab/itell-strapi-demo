import {
	getConstructedResponseScore,
	getConstructedResponses,
} from "@/lib/constructed-response";
import { getPageData } from "@/lib/utils";
import { cn, groupby } from "@itell/core/utils";
import { Card, CardContent, Skeleton } from "@itell/ui/server";
import { FrownIcon, LaughIcon, LightbulbIcon, MehIcon } from "lucide-react";
import pluralize from "pluralize";
import { QuestionChart } from "../constructed-response/question-chart";
import { CreateErrorFallback } from "../error-fallback";
import { PageLink } from "../page/page-link";

type Props = {
	userId: string;
};

export const ConstructedResponse = async ({ userId: uid }: Props) => {
	const [records, byScore] = await Promise.all([
		getConstructedResponses(uid),
		getConstructedResponseScore(uid),
	]);
	const byChapter = groupby(records, (d) => d.pageSlug);
	const chapters = Object.keys(byChapter)
		.map((k) => getPageData(k))
		.filter(Boolean);
	chapters.sort((a, b) => a.chapter - b.chapter);

	const chartData = byScore.map((s) => {
		const name = scoreLabel(s.score);
		return {
			name,
			value: s.count,
			fill: `var(--color-${name})`,
		};
	});

	return (
		<>
			{chartData.length > 0 && (
				<>
					<Card>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground">
								{pluralize("question", records.length, true)} was answered in
								total
							</p>
							<QuestionChart data={chartData} />
							<div>
								<h2 className="font-semibold text-lg">All Records</h2>
								<p className="text-sm text-muted-foreground">
									Due to randomness in question placement, you may not receive
									the same question set for a chapter{" "}
								</p>
								<div className="space-y-4 divide-y divide-border">
									{chapters.map((chapter) => {
										const answers = byChapter[chapter.page_slug];
										const excellentAnswers = answers.filter(
											(a) => a.score === 2,
										);
										return (
											<div key={chapter.index} className="space-y-4 pt-4">
												<header>
													<p
														className={cn(
															"font-semibold text-xl text-pretty tracking-tight",
														)}
													>
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
															<p className="flex-1">{a.text}</p>
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
								</div>
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</>
	);
};

const scoreLabel = (score: number) => {
	if (score === 0) return "poor";
	if (score === 1) return "average";
	if (score === 2) return "excellent";

	return "unknown";
};

ConstructedResponse.Skeleton = () => <Skeleton className="w-full h-[200px]" />;
ConstructedResponse.ErrorFallback = CreateErrorFallback(
	"Failed to display question-answering statistics",
);

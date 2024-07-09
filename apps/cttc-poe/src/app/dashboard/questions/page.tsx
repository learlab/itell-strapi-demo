import { PageLink } from "@/components/page-link";
import { Meta } from "@/config/metadata";
import { constructed_responses } from "@/drizzle/schema";
import { getSession } from "@/lib/auth";
import { incrementView } from "@/lib/dashboard/actions";
import { db } from "@/lib/db";
import { getPageData, redirectWithSearchParams } from "@/lib/utils";
import { DashboardHeader, DashboardShell } from "@dashboard/_components/shell";
import { cn, groupby } from "@itell/core/utils";
import { Card, CardContent, CardDescription } from "@itell/ui/server";
import { count, eq } from "drizzle-orm";
import { FrownIcon, LaughIcon, LightbulbIcon, MehIcon } from "lucide-react";
import pluralize from "pluralize";
import { QuestionChart } from "./_components/question-chart";

export const metadata = Meta.questions;

export default async function () {
	const { user } = await getSession();
	if (!user) {
		return redirectWithSearchParams("/auth");
	}

	incrementView(user.id, "constructed-response");

	const [records, byScore] = await Promise.all([
		getAnswers(user.id),
		getScoreCount(user.id),
	]);
	const byChapter = groupby(records, (d) => d.pageSlug);
	const chapters = Object.keys(byChapter)
		.map((k) => getPageData(k))
		.filter(Boolean);

	chapters.sort((a, b) => a.chapter - b.chapter);

	const chartData = byScore.map((s) => {
		const name = getLabel(s.score);
		return {
			name,
			value: s.count,
			fill: `var(--color-${name})`,
		};
	});

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.questions.title}
				text={Meta.questions.description}
			/>
			<Card>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground">
						{pluralize("question", records.length, true)} was answered in total
					</p>
					{records.length > 0 && (
						<>
							<QuestionChart data={chartData} />
							<div>
								<h2 className="font-semibold text-lg">All Records</h2>
								<p className="text-sm text-muted-foreground">
									Due to randomness in question placement, you may not receive
									the same question set for a chapter
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
						</>
					)}
				</CardContent>
			</Card>
		</DashboardShell>
	);
}

const getAnswers = async (userId: string) => {
	return await db
		.select()
		.from(constructed_responses)
		.where(eq(constructed_responses.userId, userId));
};

const getScoreCount = async (userId: string) => {
	return await db
		.select({ score: constructed_responses.score, count: count() })
		.from(constructed_responses)
		.where(eq(constructed_responses.userId, userId))
		.groupBy(constructed_responses.score);
};

const getLabel = (score: number) => {
	if (score === 0) return "poor";
	if (score === 1) return "average";
	if (score === 2) return "excellent";

	return "unknown";
};

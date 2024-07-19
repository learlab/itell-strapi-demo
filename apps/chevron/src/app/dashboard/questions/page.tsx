import { incrementViewAction } from "@/actions/dashboard";
import { Meta } from "@/config/metadata";
import { ConstructedResponse, constructed_responses } from "@/drizzle/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAllQuestions } from "@/lib/question";
import { getPageData, redirectWithSearchParams } from "@/lib/utils";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { cn, groupby } from "@itell/core/utils";
import { Card, CardContent } from "@itell/ui/server";
import { QuestionChart } from "@questions/question-chart";
import { count, eq } from "drizzle-orm";
import pluralize from "pluralize";

export const metadata = Meta.questions;

export default async function () {
	const { user } = await getSession();
	if (!user) {
		return redirectWithSearchParams("/auth");
	}

	incrementViewAction({ pageSlug: Meta.questions.slug });

	const [records, byScore, allQuestions] = await Promise.all([
		getAnswers(user.id),
		getScoreCount(user.id),
		getAllQuestions(),
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

	const questions: Array<{
		chunkSlug: string;
		question: string;
		answer: string;
	}> = [];
	allQuestions?.data.forEach((page) => {
		page.attributes.Content.forEach((chunk) => {
			if (chunk.QuestionAnswerResponse) {
				const parsed = JSON.parse(chunk.QuestionAnswerResponse) as {
					question: string;
					answer: string;
				};
				questions.push({
					chunkSlug: chunk.Slug,
					question: parsed.question,
					answer: parsed.answer,
				});
			}
		});
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
							<div className="grid gap-2">
								<h2 className="font-semibold text-xl">All Records</h2>
								<p className="text-sm text-muted-foreground">
									Due to randomness in question placement, you may not receive
									the same question set for a chapter
								</p>
								<div className="grid gap-4 divide-y divide-border">
									{chapters.map((chapter) => {
										const answers = byChapter[chapter.page_slug];
										const excellentAnswers = answers.filter(
											(a) => a.score === 2,
										);
										return (
											<div key={chapter.index} className="grid gap-4">
												<header>
													<p
														className={cn(
															"font-semibold text-lg text-pretty tracking-tight",
														)}
													>
														{chapter.title}
													</p>
													<p className="text-muted-foreground">
														{pluralize("answer", answers.length, true)},{" "}
														{excellentAnswers.length} excellent
													</p>
												</header>
												<div className="divide-y divide-border border space-y-2">
													{questions.map(({ chunkSlug, question, answer }) => {
														const records = answers.filter(
															(a) => a.chunkSlug === chunkSlug,
														);
														if (records.length === 0) {
															return null;
														}

														return (
															<AnswerItem
																key={chunkSlug}
																answers={records}
																question={question}
																refAnswer={answer}
															/>
														);
													})}
												</div>
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

const AnswerItem = ({
	answers,
	question,
	refAnswer,
}: { answers: ConstructedResponse[]; question: string; refAnswer: string }) => {
	return (
		<div className="space-y-2 rounded-md p-4 lg:p-6">
			<div className="space-y-1">
				<p>
					<span className="font-semibold">Question: </span>
					{question}
				</p>
				<p>
					<span className="font-semibold">Reference Answer: </span>
					{refAnswer}
				</p>
			</div>

			<div className="space-y-1">
				<p className="font-semibold">User Answers</p>
				<ul className="space-y-1 font-light leading-snug">
					{answers.map((answer) => (
						<li key={answer.id} className="ml-4 flex justify-between">
							<p>{answer.text}</p>
							<div className="flex gap-2 text-sm text-muted-foreground">
								<p>{getLabel(answer.score)}</p>
								<time>{answer.createdAt.toLocaleDateString()}</time>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

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

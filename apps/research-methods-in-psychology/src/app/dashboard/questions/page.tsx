import { incrementViewAction } from "@/actions/dashboard";
import { getAnswerStatsAction } from "@/actions/question";
import { Meta } from "@/config/metadata";
import { ConstructedResponse } from "@/drizzle/schema";
import { getSession } from "@/lib/auth";
import { getAllQuestions } from "@/lib/question";
import { getPageData, redirectWithSearchParams } from "@/lib/utils";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { Card, CardContent, CardDescription, CardHeader } from "@itell/ui/card";
import { cn } from "@itell/utils";
import { QuestionChart } from "@questions/question-chart";
import { groupBy } from "es-toolkit";
import pluralize from "pluralize";

export default async function () {
	const { user } = await getSession();
	if (!user) {
		return redirectWithSearchParams("/auth");
	}

	incrementViewAction({ pageSlug: Meta.questions.slug });

	const [[data, err], allQuestions] = await Promise.all([
		getAnswerStatsAction(),
		getAllQuestions(),
	]);
	if (err) {
		throw new Error(err.message);
	}
	const { records, byScore } = data;
	const byPage = groupBy(records, (d) => d.pageSlug);
	const pages = Object.keys(byPage)
		.map((k) => getPageData(k))
		.filter(Boolean);

	pages.sort((a, b) => a.order - b.order);

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
				<CardHeader>
					<CardDescription>
						{pluralize("question", records.length, true)} was answered in total
					</CardDescription>
				</CardHeader>
				{records.length > 0 && (
					<CardContent className="space-y-4">
						<QuestionChart data={chartData} />
						<div className="grid gap-2q">
							<h2 className="font-semibold text-xl">All Records</h2>
							<p className="text-sm text-muted-foreground">
								Due to randomness in question placement, you may not receive the
								same question set for a chapter
							</p>
							<div className="grid gap-4 divide-y divide-border">
								{pages.map((chapter) => {
									const answers = byPage[chapter.slug];
									const excellentAnswers = answers.filter((a) => a.score === 2);
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
					</CardContent>
				)}
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

const getLabel = (score: number) => {
	if (score === 0) return "poor";
	if (score === 1) return "average";
	if (score === 2) return "excellent";

	return "unknown";
};

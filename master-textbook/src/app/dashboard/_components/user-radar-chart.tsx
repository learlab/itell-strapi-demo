"use client";

import { isNil } from "es-toolkit/predicate";
import {
	RadarChart as BaseRadarChart,
	PolarAngleAxis,
	PolarGrid,
	Radar,
} from "recharts";

import { OtherStats, UserStats } from "@/actions/dashboard";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@itell/ui/chart";

const chartConfig = {
	userScaled: {
		label: "user",
		color: "hsl(var(--chart-1))",
	},
	otherScaled: {
		label: "other",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

type Props = {
	userStats: UserStats;
	otherStats: OtherStats;
	userProgress: number;
	otherProgress: number;
};

export const UserRadarChart = ({
	userStats,
	otherStats,
	userProgress,
	otherProgress,
}: Props) => {
	const data = [
		{
			label: "Progress",
			user: userProgress,
			other: otherProgress,
			userScaled: scale(userProgress, otherProgress),
			otherScaled: 1,
			description: "Number of pages unlocked",
		},
		{
			label: "Total Summaries",
			user: userStats.totalSummaries,
			other: otherStats.totalSummaries,
			userScaled: scale(userStats.totalSummaries, otherStats.totalSummaries),
			otherScaled: 1,
			description: "Total number of summaries submitted",
		},
		{
			label: "Passed Summaries",
			user: userStats.totalPassedSummaries,
			other: otherStats.totalPassedSummaries,
			userScaled: scale(
				userStats.totalPassedSummaries,
				otherStats.totalPassedSummaries,
			),
			otherScaled: 1,
			description:
				"Total number of summaries that scored well in both content score and language score",
		},
		{
			label: "Content Score",
			user: userStats.contentScore,
			other: otherStats.contentScore,
			userScaled:
				userStats.contentScore && otherStats.contentScore
					? scale(userStats.contentScore, otherStats.contentScore)
					: 0,
			otherScaled: 1,
			description:
				"Measures the semantic similarity between the summary and the original text. The higher the score, the better the summary describes the main points of the text.",
		},
		{
			label: "Language Score",
			user: userStats.languageScore,
			other: otherStats.languageScore,
			userScaled:
				userStats.languageScore && otherStats.languageScore
					? scale(userStats.languageScore, otherStats.languageScore)
					: 0,
			otherScaled: 1,
			description:
				"Measures the language quality of the summary. The higher the score, the better the summary wording.",
		},

		{
			label: "Correct Answers",
			user: userStats.totalPassedAnswers,
			other: otherStats.totalPassedAnswers,
			userScaled: scale(
				userStats.totalPassedAnswers,
				otherStats.totalPassedAnswers,
			),
			otherScaled: 1,
			description: "Total number of questions answered during reading.",
		},
	];

	return (
		<div className="flex items-center justify-center">
			<div className="sr-only" id="radar-chart-title">
				<h3>
					Radar Chart: user is{" "}
					<span>{data[0].userScaled > 1 ? "ahead of" : "behind"}</span> median
					reading progress
				</h3>
			</div>

			<div className="sr-only" id="radar-chart-description">
				<p>
					This radar chart compares the user's statistics across several
					categories with the median of other users. Key observations are the
					following:
				</p>
				<ul>
					<li>
						User completed {data[0].user} pages, median is {data[0].other}, user
						is {data[0].userScaled > 1 ? "ahead of" : "behind"} the median.
					</li>
					<li>
						User submitted {data[1].user} summaries, median is{" "}
						{Math.round(data[1].other || 0)}, user is{" "}
						{data[1].userScaled > 1 ? "ahead of" : "behind"} the median.
					</li>
					<li>
						User passed {data[2].user} summaries, median is{" "}
						{Math.round(data[2].other || 0)}, user is{" "}
						{data[2].userScaled > 1 ? "ahead of" : "behind"} the median.
					</li>
					<li>
						User scored {data[3].user} in summary content score, median is{" "}
						{data[3].other ? Math.round(data[3].other) : "NA"}, user is{" "}
						{data[3].userScaled > 1 ? "ahead of" : "behind"} the median.
					</li>
					<li>
						User scored {data[4].user} in summary language score, median is{" "}
						{data[4].other ? Math.round(data[4].other) : "NA"}, user is{" "}
						{data[4].userScaled > 1 ? "ahead of" : "behind"} the median.
					</li>
					<li>
						User had {data[5].user} correct answer to questions, median is{" "}
						{Math.round(data[5].other || 0)}, user is{" "}
						{data[5].userScaled > 1 ? "ahead of" : "behind"} the median.
					</li>
				</ul>
			</div>

			<ChartContainer
				config={chartConfig}
				className="mx-auto max-w-2xl min-h-[350px]"
				aria-labelledby="radar-chart-title"
				aria-describedby="radar-chart-description"
			>
				<BaseRadarChart
					data={data}
					margin={{
						right: 60,
						left: 60,
					}}
					accessibilityLayer
				>
					<ChartTooltip
						cursor={false}
						content={
							<ChartTooltipContent
								indicator="line"
								descriptionKey="description"
								className="xl:text-base"
								valueFn={(item) => {
									if (item.dataKey === "userScaled") {
										return isNil(item.payload.user) ? "NA" : item.payload.user;
									}

									if (item.dataKey === "otherScaled") {
										return isNil(item.payload.other)
											? "NA"
											: item.payload.other;
									}
								}}
							/>
						}
					/>
					<PolarGrid />
					<PolarAngleAxis
						dataKey="label"
						tick={({ x, y, textAnchor, value, index, ...props }) => {
							const d = data[index];
							const label = getComparisonText(d.user, d.other);
							return (
								<text
									x={x}
									y={index === 0 ? y - 10 : y}
									textAnchor={textAnchor}
									fontSize={13}
									fontWeight={500}
									{...props}
								>
									<tspan
										className="lg:text-sm"
										fill={
											label === "NA" || label === "same" || label === 0
												? "var(--color-muted-foreground)"
												: (typeof label === "number" && label > 0) ||
														label === "ahead"
													? "var(--color-otherScaled)"
													: "var(--color-userScaled)"
										}
									>
										{label}
										{typeof label === "number" ? "%" : ""}
									</tspan>
									<tspan
										x={x}
										dy={"1rem"}
										fontSize={12}
										className="fill-muted-foreground lg:text-sm"
									>
										{d.label}
									</tspan>
								</text>
							);
						}}
					/>
					<Radar
						dataKey="userScaled"
						fillOpacity={0}
						stroke="var(--color-userScaled)"
						strokeWidth={2}
					/>
					<Radar
						dataKey="otherScaled"
						fillOpacity={0}
						stroke="var(--color-otherScaled)"
						strokeWidth={2}
					/>
					<ChartLegend className="mt-8" content={<ChartLegendContent />} />
				</BaseRadarChart>
			</ChartContainer>
		</div>
	);
};

const getComparisonText = (user: number | null, other: number | null) => {
	const pct = user && other ? getRelativePct(user, other) : undefined;
	if (pct !== undefined) {
		return pct;
	}

	if (isNil(user)) {
		return "NA";
	}

	if (other === 0) {
		return user === 0 ? "same" : user > 0 ? "ahead" : "behind";
	}

	return "NA";
};

const getRelativePct = (a: number, b: number) => {
	if (b === 0) {
		return undefined;
	}

	return Math.round(((a - b) / Math.abs(b)) * 100);
};

const scale = (a: number, b: number) => {
	if (Math.abs(b) < Number.EPSILON) {
		return a === 0 ? 0 : 2;
	}

	return a / Math.abs(b);
};

"use client";

import {
	RadarChart as BaseRadarChart,
	PolarAngleAxis,
	PolarGrid,
	Radar,
} from "recharts";

import { OtherStats, UserStats } from "@/lib/dashboard";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@itell/ui/client";

const chartConfig = {
	userScaled: {
		label: "user",
		color: "hsl(var(--chart-1))",
	},
	other: {
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
			description: "Number of pages unlocked",
		},
		{
			label: "Total Summaries",
			user: userStats.totalSummaries,
			other: otherStats.avgTotalSummaries,
			userScaled: scale(userStats.totalSummaries, otherStats.avgTotalSummaries),
			description: "Total number of summaries submitted",
		},
		{
			label: "Passed Summaries",
			user: userStats.totalPassedSummaries,
			other: otherStats.avgTotalPassedSummaries,
			userScaled: scale(
				userStats.totalPassedAnswers,
				otherStats.avgTotalPassedAnswers,
			),
			description:
				"Total number of summaries that scored well in both content score and language score",
		},
		{
			label: "Content Score",
			user: userStats.avgContentScore,
			other: otherStats.avgContentScore,
			userScaled: scale(userStats.avgContentScore, otherStats.avgContentScore),
			description:
				"Measures the semantic similarity between the summary and the original text. The higher the score, the better the summary describes the main points of the text.",
		},
		{
			label: "Language Score",
			user: userStats.avgLanguageScore,
			other: otherStats.avgLanguageScore,
			userScaled: scale(
				userStats.avgLanguageScore,
				otherStats.avgLanguageScore,
			),
			description:
				"Measures the language quality of the summary. The higher the score, the better the summary wording.",
		},

		{
			label: "Correct Answers",
			user: userStats.totalPassedAnswers,
			other: otherStats.avgTotalPassedAnswers,
			userScaled: scale(
				userStats.totalPassedAnswers,
				otherStats.avgTotalPassedAnswers,
			),
			description: "Total number of questions answered during reading.",
		},
	];

	return (
		<div className="flex items-center justify-center">
			<ChartContainer
				config={chartConfig}
				className="mx-auto max-w-2xl min-h-[350px]"
			>
				<BaseRadarChart
					data={data}
					margin={{
						right: 60,
						left: 60,
					}}
				>
					<ChartTooltip
						cursor={false}
						content={
							<ChartTooltipContent
								indicator="line"
								descriptionKey="description"
								valueFn={(item) => {
									if (item.dataKey === "userScaled") {
										return item.payload.user;
									}

									if (item.dataKey === "other") {
										return item.payload.other;
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
							const pct = getRelativePct(d.user, d.other);
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
											!pct || pct === 0
												? "var(--color-muted-foreground)"
												: pct > 0
													? "var(--color-other)"
													: "var(--color-userScaled)"
										}
									>{`${pct && pct > 0 ? "+" : ""}${pct}%`}</tspan>
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
						fill="var(--color-userScaled)"
						fillOpacity={0}
						stroke="var(--color-userScaled)"
						strokeWidth={2}
					/>
					<Radar
						dataKey="other"
						fill="var(--color-other)"
						fillOpacity={0}
						stroke="var(--color-other)"
						strokeWidth={2}
					/>
					<ChartLegend className="mt-8" content={<ChartLegendContent />} />
				</BaseRadarChart>
			</ChartContainer>
		</div>
	);
};

const getRelativePct = (a: number, b: number) => {
	if (b === 0) {
		return undefined;
	}

	return Math.round(((a - b) / Math.abs(b)) * 100);
};

const scale = (a: number, b: number) => {
	const pct = getRelativePct(a, b);
	if (pct === undefined) {
		return "NA";
	}

	if (b === 0) {
		return 0;
	}

	return 1 + pct / 100;
};
